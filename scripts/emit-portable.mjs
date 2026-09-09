#!/usr/bin/env node
// emit-portable.mjs — emit a portable Agent Plugins (spec v1.0.0) package from haku.
// Skills-only: agents, gates, hooks, and monitors are not representable component
// types in the v1 spec — see docs/LEAN-PLAN.md §8 D9 for what is dropped and why.
//
// Usage:
//   node scripts/emit-portable.mjs [--pack <name>]... [--out <dir>] [--check]
//
//   --pack <name>   Include a pack's skills (repeatable). Default: core only.
//   --out <dir>     Output directory (default: dist/agent-plugins).
//   --check         Emit to a temp dir and verify <out> matches it exactly.
//                   Exit 1 on drift — used by the portable-drift CI job (D9).

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SPEC_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";

// ---------- args ----------

const packs = [];
let outDir = "dist/agent-plugins";
let check = false;

for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === "--pack") packs.push(process.argv[++i] ?? fail("--pack requires a name"));
  else if (arg === "--out") outDir = process.argv[++i] ?? fail("--out requires a directory");
  else if (arg === "--check") check = true;
  else fail(`unknown argument: ${arg}`);
}

function fail(msg) {
  console.error(`emit-portable: ${msg}`);
  process.exit(1);
}

// ---------- version: latest git tag is the single version source (D9) ----------

let tag;
try {
  tag = execFileSync("git", ["describe", "--tags", "--abbrev=0"], { cwd: ROOT, encoding: "utf8" }).trim();
} catch {
  fail("no git tag found — version pins to tags (D9); tag the repo first");
}
const version = tag.replace(/^v/, "");
if (!/^\d+\.\d+\.\d+/.test(version)) fail(`latest tag ${tag} does not look like semver`);

// ---------- identity: marketplace.json is the manifest field source ----------

const marketplacePath = path.join(ROOT, ".claude-plugin", "marketplace.json");
const marketplace = JSON.parse(fs.readFileSync(marketplacePath, "utf8"));
const entry = (marketplace.plugins ?? []).find((p) => p.name === "haku");
if (!entry) fail("marketplace.json has no plugins[] entry named 'haku'");
if (!entry.description) fail("marketplace haku entry is missing a description");

// ---------- gather skills ----------

const skills = new Map(); // name -> { src, origin }

function collectSkills(baseDir, origin) {
  if (!fs.existsSync(baseDir)) return;
  for (const name of fs.readdirSync(baseDir).sort()) {
    const dir = path.join(baseDir, name);
    if (!fs.statSync(dir).isDirectory()) continue;
    if (!fs.existsSync(path.join(dir, "SKILL.md"))) continue;
    if (skills.has(name)) fail(`skill name collision: '${name}' from ${skills.get(name).origin} and ${origin}`);
    skills.set(name, { src: dir, origin });
  }
}

collectSkills(path.join(ROOT, "plugin", "skills"), "core");

const droppedAgents = [];
for (const pack of packs) {
  const packDir = path.join(ROOT, "plugin", "packs", pack);
  const packJsonPath = path.join(packDir, "pack.json");
  if (!fs.existsSync(packJsonPath)) {
    const available = fs.existsSync(path.join(ROOT, "plugin", "packs"))
      ? fs.readdirSync(path.join(ROOT, "plugin", "packs")).filter((d) =>
          fs.existsSync(path.join(ROOT, "plugin", "packs", d, "pack.json")),
        )
      : [];
    fail(`unknown pack '${pack}' — available: ${available.join(", ") || "none"}`);
  }
  const packJson = JSON.parse(fs.readFileSync(packJsonPath, "utf8"));
  for (const skill of packJson.skills ?? []) {
    const dir = path.join(packDir, "skills", skill);
    if (!fs.existsSync(path.join(dir, "SKILL.md"))) {
      fail(`pack '${pack}' lists skill '${skill}' but ${dir}/SKILL.md is missing`);
    }
    if (skills.has(skill)) fail(`skill name collision: '${skill}' from ${skills.get(skill).origin} and pack '${pack}'`);
    skills.set(skill, { src: dir, origin: `pack '${pack}'` });
  }
  droppedAgents.push(...(packJson.agents ?? []));
}

if (skills.size === 0) fail("no skills found — nothing to emit");

// ---------- Agent Skills spec conformance (spec: agentskills.io) ----------

function validateSkill(name, dir) {
  const md = fs.readFileSync(path.join(dir, "SKILL.md"), "utf8");
  const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(md);
  if (!fm) fail(`${name}: SKILL.md has no frontmatter block`);
  const block = fm[1];

  const nameLine = /^name:[ \t]*(.*)$/m.exec(block);
  if (!nameLine || !nameLine[1].trim()) fail(`${name}: frontmatter 'name' missing or empty`);
  const frontName = nameLine[1].trim();
  if (frontName !== name) fail(`${name}: frontmatter name '${frontName}' != directory name '${name}'`);
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(frontName) || frontName.includes("--"))
    fail(`${name}: name violates Agent Skills charset (lowercase alnum + single hyphens only)`);
  if (frontName.length > 64) fail(`${name}: name exceeds 64 characters`);

  const descLine = /^description:[ \t]*(.*)$/m.exec(block);
  if (!descLine) fail(`${name}: frontmatter 'description' missing`);
  const desc = descLine[1].trim();
  if (/^[>|]/.test(desc)) fail(`${name}: folded/multi-line description — keep it single-line for the portable emit`);
  if (!desc) fail(`${name}: description is empty`);
  if (desc.length > 1024) fail(`${name}: description is ${desc.length} chars (Agent Skills max 1024)`);
}

for (const [name, { src }] of skills) validateSkill(name, src);

// ---------- emit ----------

function buildPackage(dest) {
  if (fs.existsSync(dest)) {
    const hasManifest = fs.existsSync(path.join(dest, "plugin.json"));
    if (!hasManifest && fs.readdirSync(dest).length > 0)
      fail(`refusing to wipe '${dest}' — not an emitted package (no plugin.json); pass a different --out`);
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest, { recursive: true });

  for (const [name, { src }] of skills) fs.cpSync(src, path.join(dest, "skills", name), { recursive: true });

  const manifest = {
    $schema: SPEC_SCHEMA,
    name: "haku",
    version,
    description: entry.description,
    author: entry.author ?? { name: marketplace.owner?.name ?? "shrwnsan" },
    ...(entry.homepage ? { homepage: entry.homepage } : {}),
    ...(entry.repository ? { repository: entry.repository } : {}),
    ...(entry.license ? { license: entry.license } : {}),
    ...(entry.keywords ? { keywords: entry.keywords } : {}),
  };
  fs.writeFileSync(path.join(dest, "plugin.json"), JSON.stringify(manifest, null, 2) + "\n");

  const packNote = packs.length ? `packs: ${packs.join(", ")}` : "core only";
  fs.writeFileSync(
    path.join(dest, "README.md"),
    `# haku — portable package

Generated by \`scripts/emit-portable.mjs\` from the haku repo at tag \`${tag}\` — do not
hand-edit. Regenerate and commit instead; CI's \`portable-drift\` job re-emits and
fails on any difference (LEAN-PLAN §8 D9).

- Spec: Agent Plugins v1.0.0 (\`${SPEC_SCHEMA}\`)
- Surface: ${skills.size} skills (${packNote}), copied verbatim and validated against
  the Agent Skills spec (name === directory, description ≤ 1024 chars).
- Version: \`${version}\`, derived from the repo's latest git tag — tags are the
  single version source.

## What a portable install does not carry (D9)

The Agent Plugins v1 spec defines exactly two component types — skills and MCP
servers. Agents, hooks, and commands are explicitly out of the v1 format, so this
package is skills-only by construction, not by omission:

- **Gate agents** (\`the-reducer\`, \`the-spec-writer\`, \`the-red-teamer\`,
  \`the-rfc-reviewer\`, \`the-retro-facilitator\`) and the \`gates/\` contracts are absent.
  Core skills still reference them by name; in a portable install the
  decide → spec → evidence loop degrades to un-gated skill guidance.
- **Ship-review (P1–P4)** stays a repo/CI predicate and cannot run from this
  package. A pull-based MCP review tool wrapping P1–P4 is the planned follow-up.
- **Monitors** (\`check-wins-cadence\`) are client-side scheduling, not a v1 component.
- **Pack agents** (e.g. ${droppedAgents.length ? droppedAgents.join(", ") : "none in this emit"}) are dropped with the same rationale.

License: ${entry.license ?? "CC-BY-SA-4.0"} — upstream haku is CC BY-SA 4.0; this
package carries the same license and attribution.
`,
  );
}

function hashTree(dir) {
  const out = new Map();
  const walk = (rel) => {
    for (const name of fs.readdirSync(path.join(dir, rel)).sort()) {
      const r = path.join(rel, name);
      const p = path.join(dir, r);
      if (fs.statSync(p).isDirectory()) walk(r);
      else out.set(r, createHash("sha256").update(fs.readFileSync(p)).digest("hex"));
    }
  };
  walk("");
  return out;
}

if (check) {
  const target = path.resolve(ROOT, outDir);
  if (!fs.existsSync(path.join(target, "plugin.json")))
    fail(`--check: ${outDir} has no emitted package — run without --check first`);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "haku-portable-"));
  const candidate = path.join(tmp, "emit");
  buildPackage(candidate);
  const a = hashTree(candidate);
  const b = hashTree(target);
  const drift = [];
  for (const [f, h] of a) if (b.get(f) !== h) drift.push(b.has(f) ? `changed: ${f}` : `missing from ${outDir}: ${f}`);
  for (const f of b.keys()) if (!a.has(f)) drift.push(`stale in ${outDir}: ${f}`);
  if (drift.length) {
    console.error(`emit-portable: drift detected between emit and ${outDir} (D9):`);
    for (const d of drift) console.error(`  ${d}`);
    process.exit(1);
  }
  console.log(`emit-portable: --check clean — ${outDir} matches the emit at tag ${tag} (${skills.size} skills)`);
} else {
  const target = path.resolve(ROOT, outDir);
  buildPackage(target);
  const coreCount = [...skills.values()].filter((s) => s.origin === "core").length;
  console.log(`emit-portable: wrote ${path.relative(ROOT, target)} at version ${version} (tag ${tag})`);
  console.log(`  skills: ${skills.size} (core ${coreCount}${packs.length ? `, packs: ${packs.join(", ")}` : ""})`);
  if (droppedAgents.length)
    console.log(`  dropped (not representable in spec v1.0.0, D9): ${droppedAgents.length} pack agent(s)`);
  console.log(`  agents/gates/hooks/monitors: not emitted — see ${path.relative(ROOT, target)}/README.md`);
}
