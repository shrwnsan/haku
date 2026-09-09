# Manifest — `haku`

This file lists everything that ships with this bundle. Use it to identify which items in `~/.claude/skills/` and `~/.claude/agents/` came from this repo (vs. skills you wrote yourself or installed from other sources).

The bundle is an **always-on core** (8 skills + 5 agents) plus **8 opt-in packs** (44 skills + 17 agents across packs), all inside `plugin/`. Packs install as a unit via `scripts/install.sh --pack <name>` and bring their own eval cases.

## Core (always installed)

### Skills (8)

| Name | One-line description |
|---|---|
| `capture` | Logs something from the current conversation into memory without re-typing — drafts the decision / win / stakeholder entry from what was just said, files it after approval. |
| `decision-log` | ADR-style capture of meaningful product/technical decisions. Especially for AI decisions tied to specific model versions. |
| `doctor` | Health-check for the memory directory and the plugin install — registry integrity, orphaned files, layout drift, privacy posture, backup status, core/pack integrity and eval coverage. Read-only by default. |
| `start` | Entry point for new users — one-question branching into first-time setup (profile → role starter kit → first decision captured) or direct routing to the right skill. |
| `strategy-doc` | Interview-driven creation of `strategy/<area-slug>.md`. Anchor read by the-spec-writer and strategy-aware pack skills. |
| `user-profile` | Anchor file (`profile.md`) capturing who you are. Read across the core and packs to tailor outputs. Owns reflections-root setup and the privacy warning. |
| `weekly` | The ~15-minute weekly ritual — wins capture, most-overdue reflection, patterns, pulse glance — composed into one guided session. |
| `wins-log` | Structured win capture (situation, action, impact, evidence, honest credit). |

### Agents (5)

| Name | One-line description |
|---|---|
| `the-rfc-reviewer` | Senior-staff-engineer-style review of engineering RFCs/design docs — problem clarity, alternatives, trade-offs, failure modes, observability, scaling, security. |
| `the-reducer` | Intent gate — reduces ambiguity, pushes back on "AI problems" that are actually UI or data problems, defaults to "no AI" stance. |
| `the-retro-facilitator` | Structured team retrospectives that produce actionable items — format selection, system diagnosis, SMART action items, psychological safety maintenance. |
| `the-red-teamer` | Spec gate and adversarial pre-launch testing for AI features — prompt injection, exfiltration, jailbreaks, out-of-distribution failures. |
| `the-spec-writer` | Turns a validated problem into a decision-ready PRD with concrete success metrics, scoped non-goals, and named seams between probabilistic and deterministic logic. |

## Packs (opt-in, install as a unit)

| Pack | Skills | Agents |
|---|---|---|
| `people` | `career-retro`, `coaching-mode`, `commitments`, `feedback-frameworks`, `hiring-craft`, `influence-without-authority`, `one-on-one-prep`, `performance-management`, `promo-case-glue`, `report-career-architect`, `report-promo-case`, `self-reflect`, `visibility-sponsorship`, `wins-curate`, `wins-due` | `the-career-coach` |
| `stakeholder` | `stakeholder-due`, `stakeholder-manage`, `stakeholder-reflect`, `stakeholder-register`, `stakeholder-synthesize` | — |
| `team` | `psychological-safety`, `team-charter`, `team-check-in`, `team-close-gap`, `team-diagnosis`, `team-lifecycle`, `team-style-inventory`, `team-workspace`, `workload-equity` | — |
| `comms` | `demo-prep`, `exec-readout-prep`, `product-pulse`, `pulse-synthesize`, `read-the-room` | `the-data-storyteller`, `the-explainer`, `the-status-crafter`, `the-translator` |
| `leadership` | `engineering-health`, `glue-audit`, `impact-audit`, `leadership-os`, `manage-glue-workers`, `metrics-design`, `patterns-watch`, `premortem`, `prioritization-frameworks`, `tech-strategy-writer` | `the-architect` |
| `engineering-ops` | — | `the-incident-responder`, `the-postmortem-facilitator`, `the-program-manager`, `the-slo-designer`, `the-vendor-evaluator` |
| `research` | — | `the-discovery-facilitator`, `the-gtm-planner`, `the-research-synthesizer` |
| `evals` | — | `the-eval-designer`, `the-prompt-critic`, `the-scientist` |

Totals: 44 pack skills + 17 pack agents. One-line descriptions for every pack item live in the pack's own `pack.json` and in the routing eval cases (`evals/routing/`).

## Deleted from bettersense

- `ai-pm-frameworks` — static reference corpus; pure context tax, no routing payoff.
- `model-migration-planner` — one-off niche; `the-vendor-evaluator` covers the pattern.

## How to identify bundle items in your Claude Code install

If you installed via `scripts/install.sh` (symlink-based), every bundle item in `~/.claude/skills/` or `~/.claude/agents/` is a symlink pointing into this repo. To list them:

```bash
find ~/.claude/skills ~/.claude/agents -maxdepth 2 -type l -lname "*haku*"
```

If you installed via plain `cp`, this manifest is your reference. Match folder/file names below against what you have in `~/.claude/`.

## Data the bundle creates (outside the repo)

The reflection-ecosystem skills create and maintain a private folder on the user's machine. These are user data, not bundle artifacts — keeping for reference:

- `~/haku-work-reflections/` (configurable via `$HAKU_WORK_REFLECTIONS_HOME`; pre-rename installs may still have `~/bettersense-work-reflections/` — `doctor` check 6 offers an `mv` to the new root rather than forking the data, per LEAN-PLAN §8 D8)
  - `profile.md` — created by `user-profile`
  - `strategy/<area-slug>.md` — created by `strategy-doc`
  - `stakeholders.json`, `managing-{up,across,down}/<slug>.md`, `teams/<slug>.md`, `archive/<category>/<slug>.md` — managed by the stakeholder pack
  - `self/reflections.md` — created by the people pack's `self-reflect`
  - `wins.md` — created by `wins-log`
  - `pulses/<area-slug>/pulse-YYYY-MM-DD.md` — created by the comms pack's `product-pulse`

Uninstalling the bundle does **not** touch this folder. The data is the user's; only they decide when (or whether) to remove it.
