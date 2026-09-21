---
title: "Gates & ship-review"
---

# Gates & ship-review

Two gate layers: a deterministic **ship-review hook** (cheap, free, no LLM) and **gate agents** behind bounded contracts (expensive judgment, run deliberately).

## Ship-review — P1–P4

Runs pre-merge, as a CI job and locally on commit. Pure code assertions—no LLM, no eval-score comparison (a deliberate split: [D2 in LEAN-PLAN](LEAN-PLAN.md)).

| # | Predicate | Fails when |
|---|---|---|
| P1 | **Decision reference** | The changeset cites no decision-log entry (`decisions/[0-9]{4}`). |
| P2 | **Eval parity** | Routing surface changed (`plugin/skills/*/SKILL.md`, `plugin/agents/*.md`) without a matching `evals/` change. |
| P3 | **Flag/shadow tokens** | An added `FLAG:` / `SHADOW:` line isn't declared in the spec doc referenced by the cited decision. |
| P4 | **Dry-run gate** | `node evals/routing/run-routing.mjs --dry-run` exits non-zero. |

Judgment work—the quality of the decision, red-team depth, RFC review substance—is **not** in the hook. That's the gate agents' job.

## Gate agents — bounded contracts

Each gate agent works from a contract at `plugin/gates/<name>/gate.md`:

- `plugin/gates/intent/` — `the-reducer`: is this an AI problem at all?
- `plugin/gates/spec/` — `the-spec-writer` + `the-red-teamer`: is the spec decision-ready and adversarially tested?
- `plugin/gates/review/` — `the-rfc-reviewer`: does the implementation review pass?

A contract bounds the agent to a narrow verdict on a narrow input—no open-ended essay review. Judge-style runs are binary-verdict, with a tracked disagreement rate; judgment stays in CI, not in the commit path.

`scripts/lint-gates.mjs` validates the contracts.
