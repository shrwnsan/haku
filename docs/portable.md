# Portable emit (Agent Plugins spec)

haku ships a skills-only build conforming to the [Agent Plugins specification](https://agent-plugins.org) v1.0.0, committed at `dist/agent-plugins/`—so spec-compatible clients can consume haku without the Claude Code plugin machinery.

## What's in the emit

- **Skills only** — the 8 core skills and pack skills as spec-conformant `skills/` (the 52 SKILL.md files are already agentskills.io-conformant).
- **Packs** — emit with `--pack <name>` (repeatable); a pack's skills are flattened alongside the core 8.
- **Version** — always the latest git tag, so the emit can't drift from a release.

Regenerate with:

```bash
node scripts/emit-portable.mjs [--pack <name> ...]
```

CI runs a `portable-drift --check` job: if `dist/agent-plugins` doesn't match what the emitter produces from the tagged tree, the build fails. The output is validated against the official JSON schema.

## What deliberately doesn't port

Spec v1.0.0 covers skills + MCP servers only. Recorded as [D9 in LEAN-PLAN](LEAN-PLAN.md):

- **Gate agents** don't ship (not in the spec).
- **Ship-review hooks P1–P4** stay Claude Code-only; a pull-based MCP review tool is the possible follow-up.
- **`install.sh` symlinks** don't apply.

The consequence: a spec-client install gets haku's skills, not its gates. If you live in the gates, use Claude Code.
