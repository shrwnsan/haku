# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`haku` is a lean Claude Code plugin for AI PMs, engineering managers, TPMs, and senior ICs: an always-on core (8 skills + 5 agents) that runs the decide → spec → evidence loop, plus 8 opt-in role packs. Users install from the marketplace (`shrwnsan/haku`) or by running `scripts/install.sh` (add `--pack <name>` for packs). The repo also contains an Astro/Starlight documentation site at `site/`. Architecture and execution plan: `docs/LEAN-PLAN.md`.

## Repo structure

```
plugin/           — the installable plugin (source of truth for all skills and agents)
  skills/         — one directory per skill; each contains at minimum a SKILL.md
  agents/         — one .md file per agent
  packs/<name>/   — one pack.json per opt-in pack (lists its skills + agents)
site/             — Astro + Starlight docs site (astro.config.mjs configures sidebar/nav)
scripts/          — install.sh / uninstall.sh (bash) + install.ps1 / uninstall.ps1 (Windows)
evals/routing/    — golden routing dataset, runner, and per-pack case files
.claude-plugin/   — marketplace.json (root) + plugin/.claude-plugin/plugin.json
MANIFEST.md       — core + pack inventory
```

## Plugin file formats

**Skills** (`plugin/skills/<name>/SKILL.md`) — YAML frontmatter with `name` and `description`, followed by the skill's instruction body in Markdown.

**Agents** (`plugin/agents/<name>.md`) — YAML frontmatter with `name`, `description`, and `tools`, followed by the agent system prompt.

The `description` field in both formats is the trigger condition Claude uses for auto-routing. Keep it precise and action-oriented. **Descriptions are eval surface:** they're what `evals/routing/` validates, so changing one requires updating routing cases and re-running the suite.

Word budgets (LEAN-PLAN §2): core skill/agent bodies ≤ 800 words each, core total ≤ 10,000 words. Measure a body as everything after the frontmatter.

## The eval gate

Every change gates on:

```bash
node evals/routing/run-routing.mjs --dry-run          # label/schema validation
node evals/routing/run-routing.mjs --pack <name>      # pack-scoped cases
```

`evals/routing/baseline.json` pins the pre-feat routing results and judge model; it is regenerated only by a decision-citing commit (LEAN-PLAN §8 D4) — never as a side effect of adding cases. New cases must carry a `source` field citing the failure that motivated them.

## Installation mechanics

`scripts/install.sh` creates **symlinks** (not copies) from `~/.claude/skills/<name>` and `~/.claude/agents/<name>.md` into this repo — pulling updates auto-updates installed skills. `--scope=project` installs into a project's `.claude/` instead. To verify installed bundle items:

```bash
find ~/.claude/skills ~/.claude/agents -maxdepth 2 -type l -lname "*haku*"
```

## Documentation site

The site lives in `site/` (Astro + [Starlight](https://starlight.astro.build)):

```bash
# from the site/ directory
npm install
npm run dev      # local dev server
npm run build    # production build → site/dist/
npm run preview  # preview the production build locally
```

The sidebar navigation is declared in `site/astro.config.mjs`. Adding a new docs page requires both a `.md`/`.mdx` file under `site/src/content/docs/` **and** a sidebar entry.

Skill/agent counts on the site are generated at build time by `site/scripts/gen-counts.mjs` (wired into `predev`/`prebuild` → `site/src/data/counts.json`). Never hard-code a count in site content; consume `counts.json` instead.

## User data written outside the repo

Skills that capture reflections write to `~/bettersense-work-reflections/` (overrideable via `$BETTERSENSE_WORK_REFLECTIONS_HOME`). This folder is user data — never touch it from code in this repo. Key paths:

- `profile.md` — created by `user-profile` (core; also owns root setup + privacy warning)
- `strategy/<area-slug>.md` — created by `strategy-doc` (core)
- `wins.md` — created by `wins-log` (core)
- `stakeholders.json`, `managing-{up,across,down}/<slug>.md`, `teams/<slug>.md`, `archive/<category>/<slug>.md` — stakeholder pack
- `self/reflections.md`, `self/retros/`, `commitments.md` — people pack
- `pulses/<area-slug>/pulse-YYYY-MM-DD.md` — comms pack

## Adding a new core skill or agent

1. Create `plugin/skills/<name>/SKILL.md` (or `plugin/agents/<name>.md`) with the frontmatter above; keep the body ≤ 800 words.
2. Add a row to `MANIFEST.md` (core table) and update the counts in its intro.
3. Add at least one routing case to `evals/routing/cases.jsonl` — a positive case (`expect`) and an appearance in a neighbour's `must_not_fire` — with a `source` field, then run the dry-run gate.
4. Supporting data files live in the skill's own directory.

## Adding to a pack

1. Create the skill/agent as above, add it to the pack's `plugin/packs/<name>/pack.json`, and update `MANIFEST.md`'s pack table.
2. Add routing cases to `evals/routing/packs/<name>.jsonl` (they run via `--pack <name>`), then run the dry-run gate.

## Marketplace listing

`.claude-plugin/marketplace.json` (root) and `plugin/.claude-plugin/plugin.json` control the public listing; `plugin.json`'s `name` sets the `haku:` skill namespace. Version single-source: git tags on this repo — all manifests reference the current tag.
