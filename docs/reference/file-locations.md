# File locations

A complete map of where haku reads from and writes to on your local machine.

## Plugin files (installed, not private)

These are the skill and agent definition files. They live wherever you installed the plugin.

**macOS / Linux / WSL:**

| Install method | Location |
|---|---|
| Marketplace (user scope) | `~/.claude/plugins/` (managed by Claude Code) |
| Symlink via `scripts/install.sh` (user scope) | `~/.claude/skills/` and `~/.claude/agents/` |
| Symlink via `scripts/install.sh --scope=project` | `./.claude/skills/` and `./.claude/agents/` |

**Windows (PowerShell, native):**

| Install method | Location |
|---|---|
| Marketplace (user scope) | `$HOME\.claude\plugins\` (managed by Claude Code) |
| Script install (user scope) | `$HOME\.claude\skills\` and `$HOME\.claude\agents\` |
| Script install (project scope) | `.\.claude\skills\` and `.\.claude\agents\` |

On Windows, `$HOME` resolves to `C:\Users\<YourName>`. The `.claude` directory in your home folder is where Claude Code reads installed skills, regardless of platform.

Script installs create **symlinks** that point back into the repo, so pulling updates auto-updates the installed skills: `~/.claude/skills/wins-log` → `/path/to/haku/plugin/skills/wins-log/`. Verify what's installed:

```bash
find ~/.claude/skills ~/.claude/agents -maxdepth 2 -type l -lname "*haku*"
```

---

## Reflection data (private, gitignored)

All private data lives under `$HAKU_WORK_REFLECTIONS_HOME` (default: `~/haku-work-reflections/`). This directory is:

- Created by `user-profile` on first run
- Gitignored inside the directory itself (`.gitignore` written on creation)
- Never touched by the uninstall scripts

### Full directory map

```
~/haku-work-reflections/
│
├── .gitignore                         # created by user-profile on first run
├── README.md                          # privacy warning, created by user-profile on first run
│
├── profile.md                         # created by user-profile (core)
│
├── strategy/
│   ├── default.md                     # created by strategy-doc (single-product users)
│   └── <area-slug>.md                 # one per product/area (core)
│
├── stakeholders.json                  # index of all registered stakeholders (stakeholder pack)
│
├── managing-up/
│   └── <first-last>.md                # one per stakeholder (stakeholder pack)
├── managing-across/
│   └── <first-last>.md
├── managing-down/
│   └── <first-last>.md
├── teams/
│   └── <team-slug>.md                 # registered teams (stakeholder pack)
├── archive/
│   └── <category>/<slug>.md           # archived stakeholders (stakeholder pack)
│
├── self/                              # people pack
│   ├── reflections.md                 # written by self-reflect
│   └── retros/
│       └── retro-YYYY-MM-DD.md        # one per career-retro run
│
├── wins.md                            # written by wins-log (core)
├── commitments.md                     # written by commitments (people pack)
│
└── pulses/
    └── <area-slug>/
        └── pulse-YYYY-MM-DD.md        # one per product-pulse run (comms pack)
```

The shared **team workspace** (`$HAKU_TEAM_HOME`, e.g. `~/haku-team/`) is a *separate git repository*—only team charters, shared strategy docs, and promoted decision records go there. Nothing personal above ever does. See [Using haku as a team](../guides/team-workspace.md).

### File ownership by skill

| File | Created by | Read by | Updated by |
|---|---|---|---|
| `profile.md` | `user-profile` (core) | `the-spec-writer` (core) + installed pack skills | `user-profile` |
| `strategy/<area>.md` | `strategy-doc` (core) | `the-spec-writer`; prioritization-frameworks, metrics-design, product-pulse, pulse-synthesize when installed | `strategy-doc` |
| `stakeholders.json` | `stakeholder-register` | `stakeholder-due`, `stakeholder-manage` | `stakeholder-register`, `stakeholder-manage` |
| `managing-*/name.md`, `teams/*.md` | `stakeholder-register` | `stakeholder-reflect`, `stakeholder-synthesize`, and installed people/comms/team skills that calibrate on people | `stakeholder-reflect`, `stakeholder-manage` |
| `archive/<category>/slug.md` | `stakeholder-manage` (on archive) | `stakeholder-synthesize` (on request) | — |
| `self/retros/retro-*.md` | `career-retro` | `career-retro` (next cycle) | (immutable—new file per retro) |
| `self/reflections.md` | `self-reflect` | `patterns-watch`, `career-retro` | `self-reflect` |
| `commitments.md` | `commitments` | `commitments`, `weekly` | `commitments` |
| `wins.md` | `wins-log` (core) | `weekly`, `wins-due`, `wins-curate` when installed | `wins-log` |
| `pulses/<area>/pulse-YYYY-MM-DD.md` | `product-pulse` | `pulse-synthesize` | (immutable—new file per run) |

Stakeholder, people, comms, and team skills ship in their opt-in packs—see [Packs](../packs.md). `/haku:doctor` validates this layout and flags drift, orphaned files, and missing backups.

---

## What uninstall touches

`scripts/uninstall.sh` (and `uninstall.ps1` on Windows) removes the symlinks from `~/.claude/skills/` and `~/.claude/agents/` that point into the haku repo, plus any links left under the pre-rename plugin name.

**It never touches:**

- `~/haku-work-reflections/` — your private data
- Skills or agents you installed from other sources
- Skills or agents you wrote yourself

Your reflection data persists after uninstall. Consider a snapshot first if you think you might return:

```bash
tar -czf ~/haku-backup-YYYY-MM-DD.tar.gz -C ~ haku-work-reflections
```

Remove it manually only if you're sure:

```bash
rm -rf ~/haku-work-reflections/
```

See [Data & privacy](../data-and-privacy.md) for the full privacy and backup model.
