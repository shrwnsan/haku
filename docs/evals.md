# Evals

haku preaches *evals before vibes*—so it ships with its own. Two layers, ordered by cost: a deterministic **routing eval** that gates every change, and **output rubrics** for judge-or-human review of real transcripts. Full detail in [`evals/README.md`](../evals/README.md).

## Routing eval

The question: does the *right* skill fire on a realistic prompt—and do its near-neighbours stay quiet?

- Golden set: `evals/routing/cases.jsonl` — each case asserts the skill that should win **and** the neighbours that must not fire.
- The candidate list is read from `plugin/` **at runtime**, so the eval can never drift from what actually ships.
- Judge model + version are pinned in `baseline.json`; regenerating the baseline requires a decision-citing commit, so a silent model bump can't invalidate comparisons.

```bash
node evals/routing/run-routing.mjs --dry-run   # dataset-vs-plugin check, no API calls, CI-safe
node evals/routing/run-routing.mjs             # full run, needs an authenticated `claude` CLI
```

The runner exits non-zero on any failure—`--dry-run` is the every-PR gate, the full run is the periodic / pre-release gate.

## Output rubrics

`evals/rubrics.md` holds behavioral checklists for the ten most load-bearing skills, each with **automatic-fail** items encoding the skill's non-negotiable opinion (e.g. `the-reducer` must not endorse building the AI feature in its first response). Score behavior, not prose.

## Gate policy

Every branch must be green before and after on `--dry-run`; changes touching `plugin/skills/*/SKILL.md` or `plugin/agents/*.md` must also touch `evals/`—enforced mechanically by the ship-review hook's [P2 predicate](gates.md).

## Case provenance

Every new routing case carries a `source` field citing the observed failure that motivated it—routing miss, doctor finding, or user-reported via `capture`. The dry-run schema check enforces presence; `the-retro-facilitator` samples sourced cases monthly and kills cases with fabricated ancestry.

There is no ambient telemetry: nobody reports a routing miss unless someone captures it. `capture` is the sensor.
