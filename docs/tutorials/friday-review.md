---
title: "Tutorial: The Friday leadership review"
---

# Tutorial: The Friday leadership review

**Time:** ~8 minutes to follow this tutorial; ~15 minutes per week once it's a habit
**Skills used:** `/haku:weekly` (core), which composes `wins-due` (people pack) → `stakeholder-due` (stakeholder pack) → `patterns-watch` (leadership pack)
**Who this is for:** EMs and PMs who already have the wins log and stakeholder files set up. If you haven't done those yet, start with [Set up your stakeholder radar](stakeholder-radar.md) and [Log a win and turn it into a story](log-a-win.md) first.

**You'll learn:**
- What each segment of the review surfaces and in what order
- How the skills compose into a single Friday scan
- How to set this up as a scheduled routine so you don't have to remember to run it

> **Tip:** This entire routine ships as a single core skill: run `/haku:weekly` and it walks the same loop — wins, most-overdue stakeholder, patterns, plus a strategy glance — as one guided session. This tutorial is still worth reading once to understand what each segment does under the hood. The due-check skills need their packs installed: people, stakeholder, and leadership.

---

## The scenario

It's Friday afternoon. You're an EM. You have four direct reports, two active stakeholders you're managing across, and a manager you're managing up to. You've been logging wins and reflections intermittently — more consistently some weeks than others.

This is what a Friday review looks like after 6 weeks of using the system.

---

## Step 1: What did I accomplish this week?

```
/haku:weekly
```

`wins-due` doesn't wait for you to remember — it probes by category:

> *"Quick Friday check:*
>
> *— Any delivery this week? Something shipped, a milestone hit, a metric moved?*
> *— Any judgment calls? Something you chose not to do, a decision you made under uncertainty?*
> *— Any mentorship? A conversation that helped someone, feedback you gave, a 1:1 that went well?*
> *— Any recovery? Something that went sideways that you helped fix or contain?"*

You scan the week. You remember:
- A prod incident Monday that you helped contain (recovery)
- A conversation Thursday where you talked a junior engineer out of a risky design shortcut (mentorship)

You'd have logged neither without the probe. Both go into the log with `wins-log`, with the skill pushing you toward specificity on each.

Three minutes. Two entries you'd have forgotten by Sunday.

---

## Step 2: Who am I losing touch with?

```
Who's overdue for reflection?
```

`stakeholder-due` scans all your stakeholder files under `~/haku-work-reflections/` and surfaces:

```
Overdue (7+ days since last reflection):
  → Daniyar Seitkali (managing-up): "What does Daniyar seem to optimize for 
    that you haven't explicitly discussed?" — 12 days overdue

  → Mei-Lin Chou (managing-across): "Where have you and Mei-Lin agreed easily 
    — and what does that tell you?" — 9 days overdue

Coming up this week:
  → Reports (managing-down): "Who on your team is getting the most of your 
    attention right now — and who isn't?" — due in 3 days
```

You do the Daniyar reflection now — takes 8 minutes. The Mei-Lin question goes on Monday's list. The managing-down question you'll do in your next team 1:1 prep.

What you don't do: let a relationship drift for a month and then wonder why the next conversation felt harder than it should have.

---

## Step 3: What am I not seeing?

```
Any patterns worth noting this week?
```

`patterns-watch` scans across your wins log, stakeholder files, and self-reflection entries (if you have the people pack) and surfaces what you didn't ask about:

> *"A few things across this week's data:*
>
> *— Your last four wins entries are all delivery or recovery. No judgment entries since early March. You have a promo cycle in 10 weeks — judgment is typically the thinnest dimension in promo packets for PMs. Worth probing this next week.*
>
> *— You've reflected on Daniyar three times this month. Mei-Lin hasn't had an entry in 19 days, and you're co-planning a launch with her team. Overdue cadence aside, this is a relationship that's changing fast — thin reflection coverage is a risk.*
>
> *— Your wins log mentions 'the platform incident' twice without a full entry. Either log it properly or note why it doesn't merit one."*

This is the part of the review that most surprises people the first time they see it. The scan doesn't just show you what you asked about — it shows you what you've been avoiding.

---

## Running it as one command

Once you're used to each step, `/haku:weekly` runs the full review in one prompt:

```
/haku:weekly
```

All segments chain in sequence. Total wall-clock time: 15 minutes, most of which is you thinking and typing.

---

## Setting it up as a scheduled routine

The best version of this review runs automatically. Schedule it so it happens whether or not you remember:

```
Every Friday at 4pm, run /haku:weekly and post a summary.
```

Or, with the built-in Claude Code scheduling:

```
/schedule "Every Friday at 4pm: Friday leadership review — runs /haku:weekly"
```

> **Note:** Scheduled routines require Claude Code Desktop or OS-level scheduling — launchd (Mac), systemd (Linux), or Task Scheduler (Windows).

After a month of Friday reviews, you'll have:
- A wins log dense enough to support a promo packet
- Stakeholder files with enough entries for synthesis to surface real patterns
- A pattern history that shows how your attention has shifted over time

---

## Where to go next

- [Build a promotion case](promo-case.md) — when the wins log is dense enough to use
- [Core skills](../core.md) — what `/haku:weekly` and the rest of the core install cover
- [Packs](../packs.md) — the people, stakeholder, and leadership packs behind the due-check skills
