---
title: "First run"
---

# First run

After installation, run one command:

```
/haku:start
```

It orients you, walks through profile setup, and routes you to your first real task. You can say "stop" at any time to skip setup and jump straight to a skill.

## What setup does

Three things are worth configuring—none are required, but each one sharpens the skills that read them.

```
☐  /haku:user-profile   → creates your "who you are" anchor file + data directory
☐  /haku:strategy-doc   → creates your "what you're building" anchor (optional)
☐  /haku:weekly         → your first weekly review, once you have something logged
```

`/haku:start` walks you through the first one. Run the others manually when you're ready.

---

## 1. Set up your profile

```
set up my profile
```

Or explicitly:

```
/haku:user-profile
```

A 5-10 minute interview capturing:

- Your role, level, and who you report to (in shape, not detail—"reports to a Director who reports to a VP")
- Company size/stage and what you own
- Current strategic focus (what you're spending most time on this quarter)
- Communication preferences (concise/verbose, examples/abstractions, push back or not)
- What you're working on as a leader
- Stack (only if relevant—useful for the spec writer and the strategy doc)

On first run, this also creates `~/haku-work-reflections/`—the private local directory where all your reflection data lives—and shows you a one-time privacy notice before writing anything.

The result is `~/haku-work-reflections/profile.md`—a plain markdown file you own. The core `the-spec-writer` gate agent reads it for scope assumptions and stack defaults; installed pack skills (the translator, the explainer, coaching-mode, the reporting skills) read it for audience and calibration.

**Update it** when your role or scope materially changes—not every week.

---

## 2. Draft a strategy doc (optional)

```
draft a strategy doc for [your area]
```

Or explicitly:

```
/haku:strategy-doc
```

An interview-driven doc capturing: target problem, approach, personas, SMART metrics, 2-4 multi-month tracks, the "not working on" section, and counter-metrics.

The result is `~/haku-work-reflections/strategy/<area-slug>.md`. The spec writer anchors every spec to one of its tracks; strategy-aware pack skills (prioritization-frameworks, metrics-design, product-pulse, pulse-synthesize) read it too.

Single-product users can use `strategy/default.md`. Multi-area users create one file per area—the skill confirms the filename before writing and detects existing files.

**Skip this** if you can't yet articulate a clear target problem. A vague strategy doc is worse than none.

---

## 3. Run your first weekly review

Once you've shipped or decided something worth logging:

```
/haku:weekly
```

One ~15-minute guided session: wins capture, the single most-overdue stakeholder reflection (if the stakeholder pack is installed), a patterns scan, and a pulse glance. If the directory is still nearly empty, the skill says so and routes you back to setup instead of running a hollow ritual.

For running skills automatically on a schedule, see [Scheduling routines](../guides/scheduling.md).

---

## What's next?

With your profile set up:

- Try [`/haku:wins-log`](examples.md) — log something you shipped or did this week
- Try [`/haku:doctor`](../reference/file-locations.md) — verify your data directory is healthy
- Browse [all skills](../core.md) and [packs](../packs.md) to understand what's there before you need it

Not sure where to go? Run `/haku:start` again—it routes you based on what you're working on.
