---
title: "haku documentation"
---

# haku documentation

**haku** is a lean Claude Code plugin that runs the **decide → spec → evidence** loop: an always-on core—8 skills + 5 gate agents—that captures the decision, pressure-tests the spec, and checks what actually shipped. Eight opt-in packs bolt on per role.

Start here:

| Page | What it covers |
|---|---|
| [Install](install.md) | Marketplace, CLI, and script installs; packs; uninstall |
| [Core](core.md) | The loop, the 8 core skills, the 5 gate agents |
| [Packs](packs.md) | The 8 opt-in packs and what ships in each |
| [Evals](evals.md) | Routing evals, output rubrics, the eval-gate policy |
| [Gates & ship-review](gates.md) | P1–P4 deterministic predicates, gate agent contracts |
| [Data & privacy](data-and-privacy.md) | Where your data lives, backups, migration |
| [Portable emit](portable.md) | `dist/agent-plugins` for Agent Plugins spec clients |
| [License](license.md) | CC BY-SA 4.0 and the bettersense attribution |

Guides, tutorials, and by-role pages:

| Path | What it covers |
|---|---|
| `getting-started/` | [First run](getting-started/first-run.md), [how skills work](getting-started/how-skills-work.md), [examples](getting-started/examples.md) |
| `tutorials/` | 8 step-by-step tutorials ([index](tutorials/index.md)) |
| `guides/` | 5 worked guides—wins + stakeholder examples, profile & strategy, team workspace, scheduling |
| `roles/` | Starter kits by role: [TPMs](roles/tpms.md), [AI PMs](roles/ai-pms.md), [EMs](roles/engineering-managers.md), [senior ICs](roles/senior-ics.md) |
| `reference/` | [Environment variables](reference/env-vars.md), [file locations](reference/file-locations.md) |

Repo-level starting points: [readme](../readme.md) (story + why), [MANIFEST](../MANIFEST.md) (everything that ships), [`docs/LEAN-PLAN.md`](LEAN-PLAN.md) (architecture and execution history, incl. the decision log).
