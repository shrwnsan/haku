# The core

An always-on core of **8 skills + 5 gate agents** runs the loop: **decide → spec → evidence**. Capture the decision, pressure-test the spec, check what shipped—so every session starts smarter than the last.

Budgets are the design: core ≤ 10,000 words total, every skill body ≤ 800 words, every description ≤ 60 words. The install surface you run daily should fit in your head.

## Skills (8)

| Skill | Role in the loop |
|---|---|
| `start` | Entry point—one-question branching into first-time setup or direct routing. |
| `user-profile` | Anchor file (`profile.md`) capturing who you are; read across the core. |
| `capture` | Logs a decision / win / stakeholder entry from the conversation, without re-typing. The loop's sensor. |
| `decision-log` | ADR-style capture of meaningful decisions—especially AI decisions tied to model versions. |
| `strategy-doc` | Interview-driven `strategy/<area-slug>.md`; anchor read by the-spec-writer and strategy-aware packs. |
| `wins-log` | Structured win capture: situation, action, impact, evidence, honest credit. |
| `weekly` | The ~15-minute ritual—wins capture, overdue reflection, patterns, pulse. |
| `doctor` | Health-check for the memory directory and the install. Read-only by default. |

## Gate agents (5)

| Agent | Gate |
|---|---|
| `the-reducer` | **Intent gate**—reduces ambiguity, pushes back on "AI problems" that are UI or data problems; defaults to "no AI". |
| `the-spec-writer` | Turns a validated problem into a decision-ready PRD with success metrics and named probabilistic/deterministic seams. |
| `the-red-teamer` | **Spec gate**—prompt injection, exfiltration, jailbreaks, out-of-distribution failures. |
| `the-rfc-reviewer` | **Review gate**—staff-engineer review of RFCs and design docs. |
| `the-retro-facilitator` | Structured retros that produce SMART actions; runs inside `weekly`. |

Gate agents work from bounded contracts in [`plugin/gates/<name>/gate.md`](gates.md).

## The four mechanisms

Why a core this small is enough—[the full why](../readme.md#why):

1. **routing evals** — a golden dataset testing the actual descriptions as a classifier, gating every change
2. **compounding memory** — user-profile and decision-log make each session smarter than the last
3. **starter-kit onboarding** — a core you can hold in your head on day one
4. **cadence monitors** — `weekly` and `wins-log` as the heartbeat

Everything else is content, and content is [opt-in](packs.md).
