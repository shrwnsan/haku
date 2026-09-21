---
title: "For AI Product Managers"
---

# For AI Product Managers

You're responsible for shipping reliable products on top of a system that is, by design, unreliable in interesting ways. The asks arrive pre-solved ("can we add an LLM reranker?"), the demos always work, production sometimes doesn't, and when accuracy regresses you're the one explaining it to the CEO. The job is judgment under uncertainty—and the fear underneath it is shipping something that fails in public.

haku won't make the call for you. It makes sure the call gets made with the right questions asked first.

## Your starter kit

The evals pack earns its install here: `scripts/install.sh --pack evals`. These five earn their place in week one:

| | When it fires | What it does for you |
|---|---|---|
| `the-reducer` (core) | Any "should we add AI to…?" ask | Refuses the surface question. Walks you through whether this is an intelligence problem or a data/UI/rules problem—*before* engineering spends two weeks on it. |
| `/haku:strategy-doc` (core) | Scoping, build-vs-buy-vs-rule, model selection, guardrails | Turns the feasibility and reliability reasoning into a written strategy doc your team can execute against—and revisit when the models move. |
| `metrics-design` (leadership pack) | "How do we know this feature is working?" | Builds the metric tree—north star, leading/lagging, and the counter-metrics that catch "engagement up, product worse." |
| `/haku:decision-log` (core) | "We're going with Sonnet over Opus for this" | Captures the rationale in a format that survives the next model migration—the decision you can't reconstruct three months later. |
| `/haku:weekly` (core) | Friday, 15 minutes | The maintenance ritual: wins captured, patterns surfaced. The habit that makes everything else compound. |

## A week with haku

**Monday.** Your VP forwards a customer complaint thread: "search feels off—can we throw an LLM at it?" You paste it in. `the-reducer` fires and asks who's complaining, what their workaround is, and whether anyone has looked at the index coverage. You go check. It's a data problem. Monday memo: $0 fix, AI as follow-on.

**Wednesday.** The reranker experiment *is* justified for the enterprise tier. `strategy-doc` walks the build-vs-buy call; `decision-log` writes down why you chose the API route and what would make you revisit.

**Friday, 3pm.** `/haku:weekly`. The Monday save gets logged as a win (category: judgment). Done by 3:15.

## When you're ready for more

- **Pre-launch:** `the-eval-designer` (evals pack) → `the-red-teamer` (core) → `demo-prep` (comms pack) is the "don't fail in public" pipeline.
- **The incident:** when the model says something wrong in production, `the-incident-responder` (engineering-ops pack) gives you structure under panic, and `the-translator` (comms pack) writes the exec explanation without hype or false humility.
- **First-time setup:** run `/haku:start`—it builds your profile and hands you this kit interactively. See [Install](../install.md) and [Core](../core.md).
