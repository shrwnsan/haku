---
title: "Tutorial: Set up your profile"
---

# Tutorial: Set up your profile

**Time:** ~10 minutes
**Skills used:** `/haku:user-profile` (core)
**Who this is for:** Everyone. This is the first thing to do after installing haku.

**You'll learn:**
- What the profile interview actually asks and why each question matters
- What a finished profile looks like
- Which skills read it automatically — and what changes once it's there

**Prerequisites:** haku installed — see [the install guide](../install.md). That's it.

---

## Why this first

Most skills in the plugin produce generic output by default. They don't know whether you're a PM or an EM, whether you're at a startup or an enterprise, whether you prefer direct feedback or diplomatic framing. You end up re-establishing that context every session.

`user-profile` fixes this once. After a 10-minute interview, the result is a single private file — `~/haku-work-reflections/profile.md` — that the core skills read automatically. You explain yourself once; the skills adjust forever.

It also creates `~/haku-work-reflections/`, the directory where all your haku data lives (override the location with `$HAKU_WORK_REFLECTIONS_HOME`), and shows you a one-time privacy notice before writing anything.

---

## The scenario

You're a senior PM at a mid-size B2B SaaS company. You've just installed haku. This tutorial follows what your first session looks like.

---

## Step 1: Start the interview

In Claude Code, type:

```
/haku:user-profile
```

Before asking anything, it shows you the privacy notice:

> *"I'm about to create `~/haku-work-reflections/`, which will hold your profile and any reflections you log over time. This directory lives on your local machine only — not synced, not shared. Confirm the location, or tell me a different path if you'd prefer (e.g. an encrypted volume)."*

You confirm. The interview begins.

---

## Step 2: The interview (what it asks and why)

The skill walks through six questions. None are required — you can skip any — but each one pays off in a specific set of skills.

**1. Role and level**

> *"Start with your role. Title, level, how long you've been in it, and roughly who you report to — no names, just the shape. Something like 'Senior PM, 3 years, report to a Director of Product who reports to the VP.'"*

You answer:

> *"Senior PM, 2.5 years in role. I report to a Director of Product. My skip is the VP of Product. I lead a team of 3 engineers and 1 designer."*

*Why it matters:* `report-promo-case` and `report-career-architect` (people pack) calibrate the level bar against your current title. `coaching-mode` and `feedback-frameworks` (people pack) adjust their framing based on whether you're a manager or IC.

**2. Org and product context**

> *"Two or three sentences on the company and what you own — stage, size, your product area, your primary cross-functional partners."*

> *"Series C, ~200 people. I own the core workflow product — the thing our customers use every day. Primary partners are engineering, design, and CS. I work closely with the growth PM on shared metrics."*

*Why it matters:* `the-spec-writer` (core gate agent) anchors specs to your product context. `metrics-design` (leadership pack) doesn't suggest consumer-style metrics at an enterprise B2B company. `the-explainer` (comms pack) calibrates the audience register.

**3. Current strategic focus**

> *"What are the 2-4 things you're spending most of your time on this quarter? Not a task list — the narrative arcs you're trying to advance."*

> *"1. Reducing time-to-value for new customers — we have an onboarding drop-off problem. 2. Shipping the collaboration features we've been holding for 18 months. 3. Getting better at measuring AI feature quality — we've shipped two LLM-powered features without real evals."*

*Why it matters:* `prioritization-frameworks` (leadership pack) scores backlog items against these tracks. `product-pulse` (comms pack) watches metrics tied to them. Your `strategy-doc` and `weekly` core skills keep decisions and reviews anchored to them.

**4. Communication style**

> *"How do you want outputs framed? Direct or diplomatic? Examples or abstractions? Should the skills push back on you, or stay in support mode?"*

> *"Direct. No softening. I want pushback when my framing is off. Examples over abstractions — I'm a concrete thinker. Keep it short."*

*Why it matters:* This shapes every skill's output register. A profile that says "direct, no softening" produces a different `feedback-frameworks` output than one that says "diplomatic, my team is sensitive to criticism."

**5. What you're working on as a leader**

> *"One or two things you're actively trying to get better at as a leader. Optional, but high value — this composes with coaching, feedback, and self-reflection."*

> *"I tend to solve problems for my team instead of coaching them through it. I'm working on asking more questions before giving answers."*

*Why it matters:* `coaching-mode` (people pack) will reference this when you're in a development conversation — it knows what you're trying to practice. `self-reflect` sessions (people pack) accumulate against this.

**6. Stack and tools (optional)**

> *"Only if relevant — languages, frameworks, observability stack. Useful for the-spec-writer, the-eval-designer, the-rfc-reviewer, the-prompt-critic."*

> *"Python backend, React frontend. We use PostHog for product analytics, Datadog for infra monitoring. AI stack is Claude via the Anthropic API."*

---

## Step 3: Review and confirm

The skill drafts the profile and shows it to you before writing:

> *"Here's what I'll write to `~/haku-work-reflections/profile.md`. Anything to change?"*

```markdown
---
name: (optional)
last_updated: 2026-05-08
default_hat: pm
---

## Role
Senior PM, 2.5 years in role. Reports to a Director of Product who reports to the VP of Product. 
Leads a team of 3 engineers and 1 designer.

## Org and product context
Series C, ~200 people. Owns the core workflow product. Primary cross-functional partners: 
engineering, design, CS, and growth PM on shared metrics.

## Current strategic focus
- Reducing time-to-value for new customers (onboarding drop-off)
- Shipping collaboration features (18 months in the backlog)
- Building real eval infrastructure for AI features

## Communication style
Direct. No softening. Pushback welcome when framing is off. Examples over abstractions. Keep it short.

## What I'm working on as a leader
Tendency to solve problems for the team rather than coaching. Practicing asking questions 
before giving answers.

## Stack and tools
Python backend, React frontend. PostHog (product analytics), Datadog (infra). 
Claude via Anthropic API for AI features.
```

You confirm. File written.

---

## What changes now

From this session forward, every skill that reads `profile.md` starts with your context already loaded:

- **`the-spec-writer`** (core gate agent) — specs anchor to your product area and strategic tracks automatically; no more explaining what you own
- **`the-translator`** (comms pack) — exec comms are framed for your org size and audience register
- **`report-promo-case`** (people pack) — the promotion bar is calibrated to your current level
- **`coaching-mode`** (people pack) — knows you're trying to ask more questions; will reinforce that rather than letting you prescribe
- **`feedback-frameworks`** (people pack) — drafts feedback in your direct register, not a softened default
- **`metrics-design`** (leadership pack) — suggests B2B SaaS metrics, not consumer growth metrics

Skills that don't read the profile still work — outputs are just less calibrated.

---

## Keeping it current

The profile is a semi-static anchor. Update it when something material changes: a new role, a significant scope shift, a new strategic focus at the start of a planning cycle. Don't update it every week.

After 90 days, `user-profile` will gently ask whether anything has changed when you invoke it. It won't nag in between.

```
/haku:user-profile
```

The skill will show you the current file and let you edit specific sections rather than starting over. Coming from a pre-rename install with an old data root? `/haku:doctor` will offer to move it to the new one.

---

## Where to go next

- [Set up your stakeholder radar](stakeholder-radar.md) — the recommended first tutorial after your profile is set
- [Core skills](../core.md) — what's always installed and how the decide → spec → evidence loop fits together
