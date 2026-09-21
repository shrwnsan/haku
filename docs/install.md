---
title: "Install"
---

# Install

haku installs three ways. Skills are namespaced under `haku:` (e.g. `/haku:start`, `/haku:decision-log`).

## Claude Code marketplace (recommended)

```
/plugin marketplace add shrwnsan/haku
/plugin install haku@haku
```

> The `/plugin` commands only work in the terminal CLI — pasting them into the Claude Desktop app chat does nothing.

**Claude Desktop app:** Customize → + next to "Personal plugins" → Add marketplace → enter `shrwnsan/haku` → Sync, then Plugins → Code → find haku → +.

## Local development

```bash
claude --plugin-dir /path/to/haku/plugin
```

## Script install (symlink)

For setups that manage `~/.claude` directly, `scripts/install.sh` symlinks skills and agents into place:

```bash
scripts/install.sh                     # core only, user scope (~/.claude/{skills,agents})
scripts/install.sh --scope=project     # into ./.claude/{skills,agents} of the current dir
scripts/install.sh --pack research     # a pack, installed as a unit
scripts/install.sh --pack all          # every pack
scripts/install.sh --force             # overwrite same-named items (default: skip + warn)
```

`scripts/uninstall.sh` removes what the installer created, including legacy `bettersense`-era symlinks. Windows equivalents: `install.ps1` / `uninstall.ps1`.

Items installed by script are symlinks pointing into this repo—list them with:

```bash
find ~/.claude/skills ~/.claude/agents -maxdepth 2 -type l -lname "*haku*"
```

## First-time setup

```
/haku:start
```

The `start` skill orients you, walks through profile setup, and routes you to your first real task. Manual path: `/haku:user-profile` → `/haku:strategy-doc` (optional) → `/haku:capture`.

## Verify the install

```
/haku:doctor
```

Read-only health check: registry integrity, layout drift, backup status, core/pack integrity and eval coverage.
