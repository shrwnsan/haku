#!/usr/bin/env node
// lint-gates — validate gate contracts (LEAN-PLAN §5: "a gate without a
// contract does not run").
//
// Checks, over plugin/gates/*/gate.md:
//   1. all seven contract fields present and non-empty
//   2. `agent` names an existing core agent (plugin/agents/<name>.md)
//   3. `rounds` parses as a positive integer
//   4. the three core gates from LEAN-PLAN §5 exist (intent, spec, review)
//
// Exit codes: 0 = valid, 1 = findings.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const gatesRoot = "plugin/gates";
const agentsRoot = "plugin/agents";
const FIELDS = ["trigger", "agent", "inputs", "pass", "rounds", "exit", "failure"];
const REQUIRED_GATES = ["intent", "spec", "review"];

const findings = [];

if (!existsSync(gatesRoot)) {
  console.error(`lint-gates: ${gatesRoot}/ not found`);
  process.exit(1);
}

for (const name of readdirSync(gatesRoot)) {
  const gatePath = join(gatesRoot, name, "gate.md");
  if (!existsSync(gatePath)) {
    findings.push(`${name}/: no gate.md`);
    continue;
  }
  const text = readFileSync(gatePath, "utf8");

  const fields = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^(trigger|agent|inputs|pass|rounds|exit|failure):\s*(.+?)\s*$/);
    if (m) fields[m[1]] = m[2].replace(/\s+#.*$/, "");
  }

  for (const f of FIELDS) {
    if (!fields[f]) findings.push(`${name}/gate.md: missing or empty field \`${f}\``);
  }

  if (fields.agent && !existsSync(join(agentsRoot, `${fields.agent}.md`))) {
    findings.push(`${name}/gate.md: agent \`${fields.agent}\` has no plugin/agents/${fields.agent}.md`);
  }

  if (fields.rounds && !/^[1-9][0-9]*$/.test(fields.rounds)) {
    findings.push(`${name}/gate.md: rounds must be a positive integer (got "${fields.rounds}")`);
  }
}

for (const required of REQUIRED_GATES) {
  if (!existsSync(join(gatesRoot, required, "gate.md"))) {
    findings.push(`core gate missing: ${required}/gate.md (LEAN-PLAN §5)`);
  }
}

if (findings.length) {
  for (const f of findings) console.error(`  FAIL  ${f}`);
  console.error(`\nlint-gates: ${findings.length} finding(s)`);
  process.exit(1);
}
console.error("lint-gates: OK — all gate contracts valid");
