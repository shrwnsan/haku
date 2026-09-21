---
title: "Using haku as a team"
---

# Using haku as a team

haku is personal by default, and most of it should stay that way—your reflections on colleagues, your wins, your career retros are yours alone. But a few artifacts are inherently shared: a **team charter** the whole team commits to, a **strategy doc** partners align on, **decision records** the team cites months later. The `team-workspace` skill (team pack) lets a team share exactly those, with a privacy wall that makes leaking the private layer structurally hard.

## The two-repo model

```
~/haku-work-reflections/     PRIVATE — never shared, one person
  ├── profile.md, wins.md, self/, stakeholder files, commitments, pulses …

$HAKU_TEAM_HOME (e.g. ~/haku-team/)   SHARED — git repo, whole team
  ├── team-charters/
  ├── strategy/
  └── decisions/
```

Two separate git repositories. The team workspace has its own remote and its own access control, governed by your team on your git host. Because personal files simply aren't in the shared tree, they can't be committed there by accident—the separation *is* the protection.

## What's shareable

| Shareable | Never shared |
|---|---|
| Team charters | Stakeholder reflections (your notes on people) |
| Strategy & tech-strategy docs | Self-reflections and career retros |
| Decision records you promote to shared ADRs | Wins log, commitments |
| | Pulses (local by default—share a redacted summary manually if needed) |

Ask `team-workspace` to share something on the right-hand list and it will refuse and explain. That's the point.

## How sharing works

1. **`init`** — set up the team workspace (or point at an existing clone of your team's repo).
2. **`share`** — the skill confirms the artifact is shareable, **scans it for accidental personal content** (names from your stakeholder registry, quotes that read like private notes), copies it onto a branch, and drafts the commit and PR description.
3. **You push and open the PR.** The skill stops at the push—sharing to your team is a publish action, so it stays your call. It never pushes or opens PRs on your behalf, never creates repos, and never touches repository permissions.

## Installing

`team-workspace` ships in the **team** pack (alongside `team-charter`, `team-diagnosis`, `team-check-in`, and the rest of the team toolkit):

```bash
scripts/install.sh --pack team
```

See [Packs](../packs.md) for the full team-pack inventory.

## Why not just one shared folder?

Because that's how a candid reflection ends up in a team PR. The moment charters and stakeholder notes live in the same tree, one `git add .` leaks something career-sensitive about a colleague. The two-repo model costs a little convenience and buys a guarantee. See [Data & privacy](../data-and-privacy.md) for the full privacy model.
