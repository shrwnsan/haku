# haku

A lean [Claude Code](https://claude.com/claude-code) plugin for people who'd rather decide well than write fast — a small always-on core (8 skills + 5 gate agents) that runs the decide → spec → evidence loop, plus 8 opt-in packs you bolt on per role.

**Status: under active development** on this repo's integration history. The architecture and execution plan live in [docs/LEAN-PLAN.md](docs/LEAN-PLAN.md).

## Why

Most "AI for leaders" tooling is a big library of frameworks with a context tax paid on every session. Haku's bet is the opposite: the value is four mechanisms, not 54 skills —

1. **routing evals** — a golden dataset that tests the actual descriptions as a classifier, gating every change
2. **compounding memory** — user-profile and decision-log that make each session smarter than the last
3. **starter-kit onboarding** — a small core you can hold in your head on day one
4. **cadence monitors** — weekly and wins-log as the heartbeat of the loop

Everything else is content, and content is opt-in: `people`, `stakeholder`, `team`, `comms`, `leadership`, `engineering-ops`, `research`, `evals` — installed as a unit with `scripts/install.sh --pack <name>`, each pack bringing its own eval cases.

Measure, then ship.

## Attribution & license

Haku is a redesign of [bettersense](https://github.com/shwetank/bettersense) by Shwetank Dixit, and would not exist without it. Like bettersense, Haku is licensed **CC BY-SA 4.0** — see [LICENSE](LICENSE).
