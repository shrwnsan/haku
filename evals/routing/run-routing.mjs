#!/usr/bin/env node
// Routing eval: does each realistic prompt route to the skill/agent it should,
// and do the near-neighbours stay quiet? This measures bettersense's #1 claimed
// feature — auto-routing — by testing the actual descriptions as a classifier.
//
// The candidate list is read from plugin/ at runtime, so the eval never drifts
// from what ships. The judgement is delegated to `claude -p`.
//
//   node run-routing.mjs --dry-run     validate the dataset, no API calls (CI-safe)
//   node run-routing.mjs               run the full eval via claude -p
//   node run-routing.mjs --limit 5     run the first 5 cases
//   node run-routing.mjs --verbose     print each case result
//
// Exit code is non-zero if any case fails (or, in --dry-run, if the dataset is
// malformed), so this doubles as CI.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const pluginRoot = join(repoRoot, "plugin");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const verbose = args.includes("--verbose");
const limitArg = args.indexOf("--limit");
const limit = limitArg !== -1 ? parseInt(args[limitArg + 1], 10) : Infinity;
const modelArg = args.indexOf("--model");
const model = modelArg !== -1 ? args[modelArg + 1] : null;
const packs = [];
for (let i = 0; i < args.length; i++) if (args[i] === "--pack") packs.push(args[i + 1]);

// ---- Load the candidates (skills + agents) from the plugin ---------------

function frontmatterDescription(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const d = m[1].match(/^description:\s*(.+)$/m);
  return d ? d[1].trim() : null;
}

function loadCandidates(includedPacks) {
  const out = [];
  const seen = new Set();
  const roots = [{ skills: join(pluginRoot, "skills"), agents: join(pluginRoot, "agents") }];
  for (const p of includedPacks) {
    roots.push({ skills: join(pluginRoot, "packs", p, "skills"), agents: join(pluginRoot, "packs", p, "agents") });
  }
  for (const root of roots) {
    if (existsSync(root.skills)) {
      for (const name of readdirSync(root.skills)) {
        const f = join(root.skills, name, "SKILL.md");
        if (existsSync(f)) {
          if (seen.has(name)) throw new Error(`duplicate candidate '${name}' — installed twice?`);
          seen.add(name);
          out.push({ name, kind: "skill", description: frontmatterDescription(readFileSync(f, "utf8")) });
        }
      }
    }
    if (existsSync(root.agents)) {
      for (const file of readdirSync(root.agents)) {
        if (!file.endsWith(".md")) continue;
        const name = file.replace(/\.md$/, "");
        if (seen.has(name)) throw new Error(`duplicate candidate '${name}' — installed twice?`);
        seen.add(name);
        out.push({ name, kind: "agent", description: frontmatterDescription(readFileSync(join(root.agents, file), "utf8")) });
      }
    }
  }
  return out;
}

// Every item that exists anywhere (core or any pack). Cross-pack references in
// must_not_fire stay valid even when that pack isn't loaded for a run.
function loadKnownNames() {
  const names = new Set();
  const packsDir = join(pluginRoot, "packs");
  if (!existsSync(packsDir)) return names;
  for (const p of readdirSync(packsDir)) {
    const mf = join(packsDir, p, "pack.json");
    if (!existsSync(mf)) continue;
    const manifest = JSON.parse(readFileSync(mf, "utf8"));
    for (const s of manifest.skills || []) names.add(s);
    for (const a of manifest.agents || []) names.add(a);
  }
  return names;
}

// ---- Load the golden dataset ---------------------------------------------

function parseJsonl(file) {
  const raw = readFileSync(file, "utf8");
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("//"))
    .map((l, i) => {
      try {
        return JSON.parse(l);
      } catch (e) {
        throw new Error(`${file} line ${i + 1}: ${e.message}`);
      }
    });
}

function loadCases(includedPacks) {
  const cases = parseJsonl(join(here, "cases.jsonl"));
  for (const p of includedPacks) {
    const f = join(here, "packs", `${p}.jsonl`);
    if (existsSync(f)) cases.push(...parseJsonl(f));
  }
  return cases;
}

// ---- Build the classifier prompt -----------------------------------------

function buildPrompt(candidates, userMessage) {
  const catalog = candidates
    .map((c) => `- ${c.name} (${c.kind}): ${c.description}`)
    .join("\n");
  return [
    "You are the routing layer of a Claude Code plugin. Given a user message and a catalog of skills and agents (each with the description that governs when it should trigger), decide which SINGLE catalog item should handle the message.",
    "",
    "Rules:",
    "- Choose the one best match by the descriptions alone.",
    '- If no item is an appropriate match, answer "none".',
    "- Judge only on the descriptions provided; do not invent capabilities.",
    "",
    "Catalog:",
    catalog,
    "",
    `User message: ${JSON.stringify(userMessage)}`,
    "",
    'Respond with ONLY a JSON object on the last line: {"choice": "<name-or-none>", "reason": "<8 words max>"}',
  ].join("\n");
}

function askClaude(prompt) {
  // Pass the prompt on stdin — it's large, and giant argv strings are fragile.
  // spawnSync (unlike execFileSync) doesn't throw on nonzero exit, so we can
  // always inspect stdout for the JSON envelope, including its error form.
  const res = spawnSync("claude", ["-p", "--output-format", "json", ...(model ? ["--model", model] : [])], {
    input: prompt,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    timeout: 120000,
  });
  if (res.error) throw new Error(`could not run claude CLI: ${res.error.message}`);

  let resultText = res.stdout || "";
  try {
    const env = JSON.parse(resultText);
    if (env.is_error) {
      const hint = /authenticat/i.test(env.result || "")
        ? " (run this from an authenticated `claude` terminal — a sandboxed sub-invocation can't reuse the session's credentials)"
        : "";
      throw new Error(`claude CLI error: ${env.result}${hint}`);
    }
    resultText = env.result ?? resultText;
  } catch (e) {
    if (e.message.startsWith("claude CLI error:")) throw e;
    /* not the JSON envelope; fall through and try to parse raw text */
  }
  const matches = resultText.match(/\{[^{}]*"choice"[^{}]*\}/g);
  if (!matches) throw new Error(`no JSON choice object in model output (stderr: ${(res.stderr || "").slice(0, 120)})`);
  return JSON.parse(matches[matches.length - 1]);
}

// ---- Validate + score -----------------------------------------------------

function validate(cases, candidates, knownNames) {
  const names = new Set(candidates.map((c) => c.name));
  const errors = [];
  for (const c of cases) {
    if (!c.id || !c.prompt || !c.expect) errors.push(`${c.id || "?"}: missing id/prompt/expect`);
    if (c.expect !== "none" && !names.has(c.expect) && !knownNames.has(c.expect))
      errors.push(`${c.id}: expect '${c.expect}' is not a real skill/agent`);
    for (const n of c.must_not_fire || []) {
      if (!names.has(n) && !knownNames.has(n)) errors.push(`${c.id}: must_not_fire '${n}' is not a real skill/agent`);
    }
  }
  return errors;
}

function main() {
  const packsDir = join(pluginRoot, "packs");
  for (const p of packs) {
    if (!existsSync(join(packsDir, p, "pack.json"))) {
      console.error(`Unknown pack '${p}'. Available: ${existsSync(packsDir) ? readdirSync(packsDir).join(", ") : "(none)"}`);
      process.exit(2);
    }
  }
  const candidates = loadCandidates(packs);
  const missingDesc = candidates.filter((c) => !c.description);
  if (missingDesc.length) {
    console.error("Candidates with no description:", missingDesc.map((c) => c.name).join(", "));
    process.exit(2);
  }
  const cases = loadCases(packs);
  const errors = validate(cases, candidates, loadKnownNames());
  if (errors.length) {
    console.error("Dataset validation failed:\n" + errors.map((e) => "  - " + e).join("\n"));
    process.exit(2);
  }
  const catalogNames = new Set(candidates.map((c) => c.name));

  console.log(
    `${candidates.length} candidates, ${cases.length} cases, dataset valid.` +
      (packs.length ? ` Packs installed: ${packs.join(", ")}.` : " Core only.")
  );
  if (dryRun) {
    const covered = new Set(cases.map((c) => c.expect).filter((e) => e !== "none"));
    console.log(`Coverage: ${covered.size} distinct skills/agents asserted as expected routes.`);
    console.log("Dry run only — no API calls made.");
    return;
  }

  let pass = 0;
  let fail = 0;
  const failures = [];
  const runCases = cases.slice(0, limit);
  for (const c of runCases) {
    let choice;
    try {
      choice = askClaude(buildPrompt(candidates, c.prompt));
    } catch (e) {
      fail++;
      failures.push(`${c.id}: runner error — ${e.message}`);
      if (verbose) console.log(`✗ ${c.id}: ERROR ${e.message}`);
      continue;
    }
    const hitExpected = choice.choice === c.expect;
    // A must-not-fire neighbour that isn't installed cannot fire — only police
    // neighbours present in this run's catalog.
    const firedForbidden = (c.must_not_fire || []).filter((n) => catalogNames.has(n)).includes(choice.choice);
    if (hitExpected && !firedForbidden) {
      pass++;
      if (verbose) console.log(`✓ ${c.id}: ${choice.choice}`);
    } else {
      fail++;
      const why = firedForbidden
        ? `fired a must-not-fire neighbour (${choice.choice})`
        : `got ${choice.choice}, expected ${c.expect}`;
      failures.push(`${c.id}: ${why} — "${c.prompt.slice(0, 60)}..."`);
      if (verbose) console.log(`✗ ${c.id}: ${why}`);
    }
  }

  console.log(`\nRouting: ${pass}/${pass + fail} passed.`);
  if (failures.length) {
    console.log("Failures:\n" + failures.map((f) => "  - " + f).join("\n"));
    process.exit(1);
  }
}

main();
