---
title: "Environment variables"
---

# Environment variables

All environment variables used by haku skills, with platform-specific setup for macOS, Linux, and Windows.

## `HAKU_WORK_REFLECTIONS_HOME`

**Default:** your home directory + `/haku-work-reflections`

| Platform | Default path |
|---|---|
| macOS / Linux | `~/haku-work-reflections` |
| Windows (PowerShell) | `$HOME\haku-work-reflections` |
| Windows (WSL) | `~/haku-work-reflections` (same as Linux) |

Controls where all haku reflection data lives. Override if you want data on an encrypted volume, a different disk, or a non-standard location.

You don't need to create the directory yourself—`user-profile` creates it on first run, with a `.gitignore` and privacy README inside.

---

### macOS / Linux

```bash
# Set for the current session only:
export HAKU_WORK_REFLECTIONS_HOME="$HOME/Encrypted/haku-work-reflections"

# Persist across sessions — zsh (macOS default since Catalina):
echo 'export HAKU_WORK_REFLECTIONS_HOME="$HOME/Encrypted/haku-work-reflections"' >> ~/.zshrc

# Persist across sessions — bash (Linux default, older macOS):
echo 'export HAKU_WORK_REFLECTIONS_HOME="$HOME/Encrypted/haku-work-reflections"' >> ~/.bashrc
```

---

### Windows (PowerShell — native)

```powershell
# Set for the current PowerShell session only:
$env:HAKU_WORK_REFLECTIONS_HOME = "$HOME\Encrypted\haku-work-reflections"

# Persist across sessions (user scope, no admin required):
[System.Environment]::SetEnvironmentVariable(
    'HAKU_WORK_REFLECTIONS_HOME',
    "$HOME\Encrypted\haku-work-reflections",
    'User'
)

# Or using setx (cmd.exe / PowerShell):
setx HAKU_WORK_REFLECTIONS_HOME "%USERPROFILE%\Encrypted\haku-work-reflections"
```

> **Note — Windows path separators:** Windows paths use `\` but forward slashes (`/`) also work in PowerShell. Claude Code reads the variable and handles the path accordingly. If a skill seems to ignore the variable, check that the path doesn't contain spaces (or wrap it in quotes).

---

### Windows (WSL)

If you're running Claude Code inside WSL, follow the Linux instructions above. The WSL home directory (`~/`) is separate from your Windows home directory (`%USERPROFILE%`). If you want the data accessible from both environments, point to a path inside `/mnt/c/Users/<name>/`:

```bash
export HAKU_WORK_REFLECTIONS_HOME="/mnt/c/Users/YOUR_USERNAME/haku-work-reflections"
```

---

### When to override

- **Encrypted volume.** If you're keeping candid notes about real colleagues, an encrypted volume is a reasonable precaution.
- **Cloud sync exclusion.** If your home directory syncs to iCloud, OneDrive, or Dropbox and you don't want reflection data going there.
- **Pre-rename installs.** Installs from before the haku rename used the old default root (`~/…-work-reflections/` under the old plugin name). haku won't see that data until you either move it to the new root or point this variable at the existing path. `user-profile` and `/haku:doctor` detect the old root and offer the move.
- **Custom organization.** Some users prefer `~/.local/share/haku/` (Linux XDG) or a dedicated notes directory.

---

### Moving existing data after changing the path

Move the directory first, then set the variable. If you set the variable first, the skills look in the new location and won't find your existing files.

**macOS / Linux:**
```bash
mv ~/haku-work-reflections ~/Encrypted/haku-work-reflections
export HAKU_WORK_REFLECTIONS_HOME="$HOME/Encrypted/haku-work-reflections"
```

**Windows (PowerShell):**
```powershell
Move-Item -Path "$HOME\haku-work-reflections" -Destination "$HOME\Encrypted\haku-work-reflections"
$env:HAKU_WORK_REFLECTIONS_HOME = "$HOME\Encrypted\haku-work-reflections"
```

---

## `HAKU_TEAM_HOME`

**Optional.** Location of the shared, git-backed **team workspace** used by the `team-workspace` skill (team pack) for co-owned artifacts—charters, shared strategy docs, promoted decision records. This is a **separate repository** from your private reflections—the separation is what keeps personal notes from ever being committed to a shared repo. Suggested default: `~/haku-team`. Set it only if you use team mode; see [Using haku as a team](../guides/team-workspace.md).

## `WINS_NUDGE_THRESHOLD_DAYS`

**Optional.** Days without a logged win before the built-in wins-cadence monitor nudges you once (default `14`). The cooldown window matches the threshold. See [Scheduling routines](../guides/scheduling.md).

---

## That's the full set

haku doesn't require API keys or tokens. Beyond the three optional variables above, MCP integrations (PostHog, Datadog, Stripe, etc.) for `product-pulse` are configured through Claude Code's MCP settings, not through haku-specific environment variables.
