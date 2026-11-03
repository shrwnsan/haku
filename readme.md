# haku

**haku** is a lean [Claude Code](https://claude.com/claude-code) plugin that runs the **decide → spec → evidence** loop: an always-on core—8 skills + 5 gate agents—that captures the decision, pressure-tests the spec, and checks what actually shipped, so every session starts smarter than the last. Eight opt-in packs bolt on per role.

Built for PMs, engineering leads, and small teams shipping with AI—where the bottleneck isn't writing faster, it's deciding well.

**Status: under active development** on this repo's integration history. The architecture and execution plan live in [docs/LEAN-PLAN.md](docs/LEAN-PLAN.md).

## Why

Most "AI for leaders" tooling is a big library of frameworks with a context tax paid on every session. Haku's bet is the opposite: the value is four mechanisms, not 52 skills —

1. **routing evals** — a golden dataset that tests the actual descriptions as a classifier, gating every change
2. **compounding memory** — user-profile and decision-log that make each session smarter than the last
3. **starter-kit onboarding** — a small core you can hold in your head on day one
4. **cadence monitors** — weekly and wins-log as the heartbeat of the loop

Everything else is content, and content is opt-in: `people`, `stakeholder`, `team`, `comms`, `leadership`, `engineering-ops`, `research`, `evals` — installed as a unit with `scripts/install.sh --pack <name>`, each pack bringing its own eval cases.

The loop's shape tracks the AI-native SDLC playbook—decide, spec, evals as gates—with one deliberate divergence: capture-is-the-sensor, no ambient telemetry.

Measure, then ship.

## Agent Plugins

`haku` also ships as an [Agent Plugins](https://agent-plugins.org/) v1.0.0
package: [`dist/agent-plugins/`](dist/agent-plugins/) is committed and holds
the core 8 skills plus a generated `plugin.json` whose version pins to the
latest git tag. Regenerate after changing skills with
`node scripts/emit-portable.mjs`; CI re-emits with `--check` and fails on any
drift (LEAN-PLAN [D9](docs/LEAN-PLAN.md)). The emit is skills-only by design:
gate agents, hooks, and monitors are client-specific and have no v1
representation, so cross-client installs get the skills and the loop's
gates stay here. `--pack <name>` flattens a pack's skills alongside the core
when you want one.

## License & attribution

Licensed **CC BY-SA 4.0**—see [LICENSE](LICENSE). Haku began as a redesign of [bettersense](https://github.com/shwetank/bettersense) by Shwetank Dixit, and wouldn't exist without it.
