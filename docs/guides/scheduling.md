# Scheduling routines

Claude Code skills are stateless—they fire when invoked, not automatically. Cadence requires either a habit or a scheduler. This guide covers the options in order of recommendation.

## Built-in: wins cadence monitor

haku ships one background monitor that requires zero scheduling setup: **wins cadence**.

When the plugin is active, Claude Code runs `check-wins-cadence` automatically at the start of each session. If you haven't logged a win in more than 14 days *and* you haven't been nudged within that same window, Claude receives a single notification—one line, once per cooldown period:

> No wins logged in 18 days. Run /haku:wins-log to capture recent work before the details fade.

That's it. No cron entry, no configuration. The monitor is declared in `plugin/monitors/monitors.json`; the script in `plugin/bin/` is added to PATH automatically when the plugin loads.

**To change the cadence**, set `WINS_NUDGE_THRESHOLD_DAYS` before launching Claude Code:

```bash
# Nudge every 4 weeks instead of 2
export WINS_NUDGE_THRESHOLD_DAYS=28
```

The cooldown window matches the threshold, so a 28-day setting will nudge at most once every 28 days regardless of how many sessions you open. The monitor is completely silent until `wins.md` exists (i.e., until you've run `/haku:wins-log` at least once) and stays silent when your wins are current.

## The no-scheduler option: `/haku:weekly`

Before wiring up any automation, consider the manual ritual. The `weekly` skill (core) runs the whole maintenance loop—wins capture, the single most-overdue stakeholder reflection, a cross-cutting patterns scan, and a pulse glance—as one guided ~15-minute session. Put a recurring block on your own calendar (Friday afternoon and Monday morning are the popular slots) and run:

```
/haku:weekly
```

This needs no cron, no task configuration, and it works identically everywhere Claude Code runs. Most users should start here; add schedulers later only if the calendar block alone isn't sticking.

## Which scheduler to use

| | Calendar + `/haku:weekly` | OS-level (cron/launchd/systemd/Task Scheduler) | `/loop` in-session |
|---|---|---|---|
| Works with haku | ✅ | ✅ | ⚠️ in-session only |
| Local file access | Yes | Yes | Yes |
| Biweekly / monthly cadence | ✅ | ✅ | ❌ session-scoped |
| Fires without Claude open | No | Yes | No |
| Setup | Your calendar | Manual config | One command |

**Use the calendar + `/haku:weekly`** if you're in Claude Code most days—zero infrastructure, and the ritual is where the compounding happens.

**Use OS-level scheduling** if you want tasks to fire even when no session is open, or need monthly/quarterly cadences you won't remember to run.

**Session-scoped `/loop`** fires while a session is open and stops when you close it—not suitable for haku's weekly/monthly cadences, but useful during active work:

```
/loop 10m run /haku:weekly's pulse glance and summarize any changes
```

---

## OS-level scheduling

For cadences that need to fire whether or not Claude Code is open, use your OS's native scheduler to invoke `claude` headlessly.

Create the log directory first:

```bash
# macOS / Linux / WSL
mkdir -p ~/haku-logs

# Windows (PowerShell)
New-Item -ItemType Directory -Force "$HOME\haku-logs"
```

> **Note — pack skills:** most cadence-driven skills ship in opt-in packs (`wins-due`, `self-reflect`, `wins-curate`—people; `stakeholder-*`—stakeholder; `product-pulse`, `pulse-synthesize`—comms; `team-diagnosis`—team; `patterns-watch`—leadership). Scheduled commands only work for skills whose packs you've installed—see [Packs](../packs.md).

### macOS / Linux / WSL — cron

```bash
crontab -e
```

```bash
# Friday 4pm — wins due-list (people pack)
0 16 * * 5  claude -p "run /haku:wins-due and show me the list" >> ~/haku-logs/wins-due.log 2>&1

# Monday 9am — stakeholder due-list (stakeholder pack)
0 9 * * 1  claude -p "run /haku:stakeholder-due and show me the list" >> ~/haku-logs/stakeholder-due.log 2>&1

# First Monday of each month at 10am — self-reflection (people pack)
# (cron can't express "first Monday" directly; use a wrapper script or accept approximate timing)
0 10 1-7 * 1  claude -p "run /haku:self-reflect" >> ~/haku-logs/self-reflect.log 2>&1

# Friday 5pm — the weekly ritual (core, always installed)
0 17 * * 5  claude -p "run /haku:weekly" >> ~/haku-logs/weekly.log 2>&1
```

If `claude` isn't found by cron, use the absolute path (`which claude` to find it).

### macOS — launchd (alternative to cron)

launchd survives sleep/wake cycles better than cron. Create a plist at `~/Library/LaunchAgents/ai.haku.wins-due.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>ai.haku.wins-due</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/claude</string>
    <string>-p</string>
    <string>run /haku:wins-due and show me the list</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Weekday</key><integer>5</integer>
    <key>Hour</key><integer>16</integer>
    <key>Minute</key><integer>0</integer>
  </dict>
  <key>StandardOutPath</key>
  <string>/Users/YOUR_USERNAME/haku-logs/wins-due.log</string>
  <key>RunAtLoad</key><false/>
</dict>
</plist>
```

Replace `/usr/local/bin/claude` with your `which claude` output and `YOUR_USERNAME` with your macOS username. Load it:

```bash
launchctl load ~/Library/LaunchAgents/ai.haku.wins-due.plist
launchctl list | grep haku  # verify
```

Duplicate the file for each skill, changing `Label`, `ProgramArguments`, `StartCalendarInterval`, and `StandardOutPath`.

### Linux — systemd user timers

More observable than cron—check status, last run time, and logs.

`~/.config/systemd/user/haku-weekly.service`:

```ini
[Unit]
Description=haku weekly review ritual

[Service]
Type=oneshot
ExecStart=/usr/local/bin/claude -p "run /haku:weekly"
StandardOutput=append:%h/haku-logs/weekly.log
StandardError=append:%h/haku-logs/weekly.log
```

`~/.config/systemd/user/haku-weekly.timer`:

```ini
[Unit]
Description=Run haku weekly review every Friday

[Timer]
OnCalendar=Fri *-*-* 17:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
systemctl --user daemon-reload
systemctl --user enable --now haku-weekly.timer
systemctl --user list-timers  # verify
```

Use `%h` (expands to home directory) rather than `~` inside systemd unit files.

### Windows — Task Scheduler

```powershell
New-Item -ItemType Directory -Force "$HOME\haku-logs"

$action = New-ScheduledTaskAction `
    -Execute "claude" `
    -Argument "-p `"run /haku:weekly`""

$trigger = New-ScheduledTaskTrigger `
    -Weekly -DaysOfWeek Friday -At "5:00PM"

$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable -RunOnlyIfNetworkAvailable

Register-ScheduledTask `
    -TaskName "haku-weekly" `
    -Action $action -Trigger $trigger -Settings $settings `
    -Description "haku weekly review ritual"
```

Repeat for each skill. Verify:

```powershell
Get-ScheduledTask | Where-Object { $_.TaskName -like 'haku*' }
```

For WSL users: use the Linux (cron or systemd) instructions above inside your WSL environment.

---

## Honest constraints

Regardless of scheduling approach:

- **Output lives in Claude Code or a log file.** No mobile push, no email, no SMS.
- **OS-level tasks run headless.** A headless `claude -p` run can write to your reflection files, but anything interactive (the `weekly` ritual's questions, permission prompts) needs you present.
- **Cadence reliability scales with how often you open Claude Code.** Daily users get the full benefit. Weekly users see things drift.

Pair each scheduled task with a calendar reminder in whatever system you actually check. The calendar grabs your attention; Claude Code does the work.
