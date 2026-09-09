#!/usr/bin/env node
// Generate evals/routing/baseline.json (LEAN-PLAN §6 step 0, §8 D4).
//
// Runs the routing suite N times against the pinned judge model, aggregates
// per-case results, and writes baseline.json. baseline.json is regenerated
// ONLY by a decision-citing commit — never as a side effect of adding cases.
//
//   node make-baseline.mjs                     # 3 runs, model = $ANTHROPIC_MODEL
//   node make-baseline.mjs --runs 3 --model glm-5-turbo
//
// The judge model is pinned explicitly (no silent default drift); the claude
// CLI version is recorded alongside it.

import { writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const runsArg = args.indexOf("--runs");
const runs = runsArg !== -1 ? parseInt(args[runsArg + 1], 10) : 3;
const modelArg = args.indexOf("--model");
const model = modelArg !== -1 ? args[modelArg + 1] : process.env.ANTHROPIC_MODEL;
if (!model) {
  console.error("No judge model pinned: pass --model <id> or set ANTHROPIC_MODEL.");
  process.exit(2);
}

function sh(cmd, cmdArgs, opts = {}) {
  const res = spawnSync(cmd, cmdArgs, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024, ...opts });
  if (res.error) throw new Error(`${cmd} failed: ${res.error.message}`);
  return res;
}

const commit = sh("git", ["rev-parse", "HEAD"]).stdout.trim();
const dirty = sh("git", ["status", "--porcelain"]).stdout.trim();
if (dirty) {
  console.error("Working tree is dirty — commit the suite first; a baseline must name its commit.");
  process.exit(2);
}
const cliVersion = sh("claude", ["--version"]).stdout.trim().split(/\s+/)[1];

function runSuite() {
  const res = sh("node", [join(here, "run-routing.mjs"), "--verbose", "--model", model]);
  const passed = [];
  const failed = [];
  const errored = [];
  let total = null;
  for (const line of res.stdout.split("\n")) {
    let m = line.match(/^✓ (\S+): (.+)$/);
    if (m) {
      passed.push(m[1]);
      continue;
    }
    m = line.match(/^✗ (\S+): (.+)$/);
    if (m) {
      if (m[2].startsWith("ERROR")) errored.push(m[1]);
      else failed.push(m[1]);
      continue;
    }
    m = line.match(/^Routing: (\d+)\/(\d+) passed\./);
    if (m) total = parseInt(m[2], 10);
  }
  return { passed, failed, errored, total };
}

const runResults = [];
for (let i = 1; i <= runs; i++) {
  let r = runSuite();
  if (r.errored.length) {
    console.log(`run ${i}: ${r.errored.length} runner error(s), retrying once…`);
    const retry = runSuite();
    if (retry.errored.length <= r.errored.length) r = retry;
  }
  runResults.push(r);
  console.log(
    `run ${i}/${runs}: ${r.passed.length}/${r.total ?? r.passed.length + r.failed.length + r.errored.length} passed` +
      (r.failed.length ? ` — failed: ${r.failed.join(", ")}` : "") +
      (r.errored.length ? ` — ERRORED: ${r.errored.join(", ")}` : "")
  );
}

const perCase = {};
for (const r of runResults) {
  for (const id of r.passed) (perCase[id] ??= { hits: 0, of: 0 }).hits++, perCase[id].of++;
  for (const id of [...r.failed, ...r.errored]) (perCase[id] ??= { hits: 0, of: 0 }).of++;
}
const flaky = Object.entries(perCase)
  .filter(([, v]) => v.hits > 0 && v.hits < v.of)
  .map(([id]) => id);

const baseline = {
  _comment: "Routing baseline (LEAN-PLAN §6 step 0). Regenerate only via a decision-citing commit (§8 D4). Gate tolerance: a single-case flip re-runs twice and fails only if confirmed — the judge is stochastic.",
  commit,
  generatedAt: new Date().toISOString(),
  judge: { runner: "evals/routing/run-routing.mjs", cli: `claude@${cliVersion}`, model },
  runs: runResults.map((r) => ({
    pass: r.passed.length,
    total: r.total ?? r.passed.length + r.failed.length + r.errored.length,
    failures: r.failed,
    errors: r.errored,
  })),
  aggregate: { perCase, flaky },
};

writeFileSync(join(here, "baseline.json"), JSON.stringify(baseline, null, 2) + "\n");
console.log(
  `\nwrote baseline.json @ ${commit.slice(0, 8)} — judge ${model}, claude@${cliVersion}, ` +
    `${runs} runs, ${Object.keys(perCase).length} cases, flaky: ${flaky.length ? flaky.join(", ") : "none"}`
);
