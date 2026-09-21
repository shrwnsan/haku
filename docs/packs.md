---
title: "Packs"
---

# Packs

Packs are opt-in and install as a unit, each with its own eval cases. Core stays installed regardless.

```bash
scripts/install.sh --pack <name>       # one pack
scripts/install.sh --pack all          # every pack
```

Marketplace installs ship everything; use the script route if you want core-only or a hand-picked subset.

## The 8 packs

| Pack | Contents |
|---|---|
| `people` | 15 skills + `the-career-coach` — career retros, coaching, feedback, hiring, promo cases, one-on-one prep. |
| `stakeholder` | 5 skills — registers, synthesis, management cadence for the stakeholder map. |
| `team` | 9 skills — psychological safety, charters, check-ins, diagnosis, workload equity. |
| `comms` | 5 skills + 4 agents — demo prep, exec readouts, product pulse; data-storyteller, explainer, status-crafter, translator. |
| `leadership` | 10 skills + `the-architect` — engineering health, metrics design, premortems, tech strategy. |
| `engineering-ops` | 5 agents — incident responder, postmortem facilitator, program manager, SLO designer, vendor evaluator. |
| `research` | 3 agents — discovery facilitator, GTM planner, research synthesizer. |
| `evals` | 3 agents — eval designer, prompt critic, scientist. |

Totals: **44 pack skills + 17 pack agents**. One-line descriptions for every item live in each pack's `plugin/packs/<name>/pack.json`.

## Packs bring their own evals

A pack isn't just content—its skills and agents land with routing cases in `evals/routing/cases.jsonl`, split core vs. pack. The [eval gate](evals.md) checks pack-added descriptions the same way it checks the core, so installing a pack can't quietly degrade routing for what you already use.

## Deliberately deleted

Two bettersense items did not survive the lean cut (rationale in [LEAN-PLAN](LEAN-PLAN.md)):

- `ai-pm-frameworks` — static reference corpus; pure context tax, no routing payoff.
- `model-migration-planner` — one-off niche; `the-vendor-evaluator` covers the pattern.
