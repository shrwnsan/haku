// Generates src/data/counts.json from the plugin source of truth so the site
// never states a skill/agent count that drifts from what actually ships.
// Counts the always-on core (plugin/skills, plugin/agents) plus every opt-in
// pack under plugin/packs/<name>/{skills,agents}.
import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = resolve(siteRoot, "..", "plugin");

const countSkills = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).filter((name) => {
        const sub = join(dir, name);
        return statSync(sub).isDirectory() && existsSync(join(sub, "SKILL.md"));
      }).length
    : 0;

const countAgents = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).filter((name) => name.endsWith(".md")).length
    : 0;

const core = {
  skills: countSkills(join(pluginRoot, "skills")),
  agents: countAgents(join(pluginRoot, "agents")),
};

const packsRoot = join(pluginRoot, "packs");
const packNames = existsSync(packsRoot)
  ? readdirSync(packsRoot).filter((name) => statSync(join(packsRoot, name)).isDirectory())
  : [];

const packs = { count: packNames.length, skills: 0, agents: 0 };
for (const name of packNames) {
  packs.skills += countSkills(join(packsRoot, name, "skills"));
  packs.agents += countAgents(join(packsRoot, name, "agents"));
}

const out = join(siteRoot, "src", "data", "counts.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(
  out,
  JSON.stringify(
    {
      skills: core.skills + packs.skills,
      agents: core.agents + packs.agents,
      core,
      packs,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `counts.json: ${core.skills + packs.skills} skills, ${core.agents + packs.agents} agents (core ${core.skills}+${core.agents}, ${packs.count} packs ${packs.skills}+${packs.agents})`,
);
