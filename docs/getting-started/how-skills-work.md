# How skills work

## What a skill is

A Claude Code skill is a markdown file with YAML frontmatter that lives in `~/.claude/skills/<name>/SKILL.md`. Claude Code reads these files and uses them to:

1. **Auto-route** incoming prompts to the right skill based on the `description` in frontmatter
2. **Load the skill body**—operating principles, anti-patterns, composition hints—when context matches

The frontmatter looks like this:

```yaml
---
name: capture
description: Use when the user wants to record something worth keeping—a win, a decision context, a reflection. Trigger phrases include "log this", "capture that", "write that down before I forget"...
---
```

The `description` field is the routing signal. Claude matches it against what you type—not by keyword, but semantically. You say *"I need to give Priya some hard feedback"* and Claude routes toward feedback work without you knowing the skill's name.

---

## Auto-routing vs. explicit invocation

**Auto-routing**—happens when Claude recognizes a match between your prompt and a skill's description. Works well for high-specificity situations (you describe what you're doing, the skill fires).

**Explicit invocation**—use `/haku:<skill-name>` to force a specific skill, even if the auto-router wouldn't have picked it:

```
/haku:start
/haku:capture
/haku:user-profile
/haku:doctor
```

Both paths load the same skill body. Explicit invocation is useful when you want a specific framework and don't want to rely on the router's interpretation.

haku's core is deliberately small: 8 always-installed skills (`start`, `user-profile`, `capture`, `decision-log`, `strategy-doc`, `wins-log`, `weekly`, `doctor`) and 5 gate agents (`the-reducer`, `the-spec-writer`, `the-red-teamer`, `the-rfc-reviewer`, `the-retro-facilitator`). Everything else—stakeholder work, people management, comms, team health—arrives via opt-in packs; see [Packs](../packs.md). A pack skill is only invocable if its pack is installed.

---

## What skills add over plain Claude

Two things that matter most under pressure:

### 1. Auto-routing removes the prompt-engineering tax

You describe the situation in your own words. At 4:47pm Friday when your VP messages *"can we throw an LLM at search?"*, you won't remember to ask for "the reducer framework with opinionated default-to-no-AI stance." The skill fires on the situation.

### 2. Skills push back on bad framing

Plain Claude is helpful in the direction you point it—even when the direction is wrong. A skill bakes in an opinion that interrupts you:

- "Is this actually an AI problem, or a data/UI/rules problem?"
- "Where's the eval coverage before you commit engineering?"
- "That's a character label, not a behavior—what specifically did they do?"

The forcing functions are where the value is. They're the difference between having the conversation you set out to have vs. the conversation you should have had. In haku this is formalized as the decide → spec → evidence loop: `the-reducer` shapes the intent, `the-spec-writer` and `the-red-teamer` pressure-test the plan, `the-rfc-reviewer` and `the-retro-facilitator` check what actually shipped.

---

## Composition and cross-skill handoffs

Several skills note that they "compose with" other skills. This is informational—not an auto-load.

When `coaching-mode` (people pack) says it composes with `feedback-frameworks` (also people pack), it means: the output from coaching naturally feeds into feedback work, and the skill body includes enough structure to approximate the other skill. But to get the full treatment—all the forcing functions, anti-pattern checks, and discipline of the second skill—**explicitly invoke it** in a new turn:

```
/haku:feedback-frameworks
```

What you get inside the original skill is a reasonable shorthand. What you get from explicit invocation is the full framework.

---

## Updating skills

If you installed via symlinks (the `scripts/install.sh` default), skills update automatically on `git pull`. The file Claude reads is the same file in the repo.

If you installed via copy, re-run `scripts/install.sh` to switch to symlinks. See [Install](../install.md).

**Inside an active session:** editing the skill body usually takes effect on the next invocation. Changing the `description` (which affects routing) may not be picked up until a new session. Changes to the `name` field always require a new session.

**Safe rule:** start a new Claude Code session after any non-trivial skill change.
