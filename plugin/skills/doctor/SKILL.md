---
name: doctor
description: Use to health-check the user's bettersense memory directory — validate the file layout, catch problems before they cost data, and set up backups. Trigger phrases include "run bettersense doctor", "check my reflection files", "is my bettersense data okay", "something seems off with my stakeholder files", "back up my reflections", "I'm moving to a new machine". Validates ~/bettersense-work-reflections/ (or $BETTERSENSE_WORK_REFLECTIONS_HOME): stakeholders.json integrity, orphaned or unregistered stakeholder files, layout drift, and backup status. Read-only by default — proposes fixes and applies them only with explicit approval per fix.
---

# Doctor

Years of reflections, wins, and decision context live in one plaintext directory. This skill is the trust layer: it verifies that directory is healthy, catches corruption or drift early, confirms the plugin install is intact, and makes sure the user has a backup before they need one.

**Read-only by default.** Run every check without modifying anything, present findings, then offer fixes one at a time. Never bulk-fix without approval. Never delete user content — quarantine (rename with a `.orphaned` suffix or move to `_attic/`) is the strongest action, and only with approval.

## Locate the data

Root is `$BETTERSENSE_WORK_REFLECTIONS_HOME` if set, else `~/bettersense-work-reflections/`. If it doesn't exist at all, that isn't an error — the user hasn't set up yet. Say so and point to `start`. Don't create anything.

## The checks

Run all of them; report as a single table (✅ / ⚠️ / ❌ per check).

### 1. Registry integrity

`stakeholders.json` parses as JSON with `version` and a `stakeholders` array; every entry has `name`, `category`, slug; categories are `managing-up`/`managing-across`/`managing-down`/`teams`; no duplicate slugs. (Stakeholder data only exists if the stakeholder pack is installed — skip cleanly if absent.) If the JSON is corrupt: report the parse error and offer a rebuild by scanning category directories (each file's frontmatter is authoritative), showing the rebuilt registry for approval; save the corrupt original as `stakeholders.json.bak` first.

### 2. Registry ↔ files consistency

Missing files (registry entry, no `.md`), orphaned files (`.md` with no registry entry — common after hand-editing), and category mismatches (frontmatter `category:` vs. directory). Offers: create a stub or remove the entry; re-register (preserves history) or quarantine; reconcile to the directory a due-scan would read.

### 3. Layout drift

Expected structure where content implies it: `profile.md`, `wins.md`, `strategy/`, `self/`, `pulses/<area>/` — absence is fine (feature unused), *misplacement* is flagged (a pulse file at the root, a stakeholder file outside any category dir). Pulse files match the `pulse-YYYY-MM-DD.md` naming synthesis depends on; reflection dates are real (a `## 2026-13-40` heading breaks due-ness math).

### 4. Privacy posture

`.gitignore` exists in the root (created by `user-profile`); if missing, offer to write it (`*` + `!.gitignore`). Warn — don't block — if the root sits inside a cloud-synced folder (Dropbox/iCloud/OneDrive): syncing is a legitimate backup choice, but the user should make it knowingly for career-sensitive plaintext. Confirm the root `README.md` privacy note; offer to write it if missing.

### 5. Backup status

The check most likely to matter someday. Is the directory a git repo with a remote, and when did it last commit? If not: report size and age of the data ("214 entries across 9 files since 2026-01"), and offer a **snapshot** (`tar -czf ~/bettersense-backup-YYYY-MM-DD.tar.gz -C ~ bettersense-work-reflections`) or **versioning** (`git init` + first commit, noting any remote must be private and that pushing sends the data to that host — the user's call, stated plainly). Flag a backup older than ~30 days of new entries.

### 6. Plugin health (lean)

- **Core intact:** the 8 core skills and 5 gate agents are present in the install. A missing gate warns loudly — the decide → spec → evidence loop can't run without it.
- **Packs:** list detected packs (pack skills/agents present in the install). Flag a pack whose skills are installed without its eval cases, or whose routing stopped being exercised.
- **Eval coverage:** if the plugin tree is reachable, run `node evals/routing/run-routing.mjs --dry-run` (plus `--pack <name>` per installed pack) and report failing labels. Note error categories with zero eval cases as blind spots.

## Output format

```
# haku doctor — YYYY-MM-DD

| Check | Status | Detail |
|---|---|---|
| Registry integrity | ✅ | 7 stakeholders, valid JSON |
| Registry ↔ files   | ⚠️ | 1 orphaned file: managing-down/alex-kim.md |
| Layout             | ✅ | |
| Privacy posture    | ✅ | .gitignore present; local-only path |
| Backup             | ❌ | No backup found; 214 entries at risk |
| Plugin health      | ✅ | core 8+5 intact; packs: people, evals |

## Proposed fixes (each needs your OK)
1. Re-register alex-kim.md (keeps all 12 entries)
2. Create tonight's snapshot: tar -czf ~/bettersense-backup-...
```

Then walk fixes one at a time. End by suggesting a cadence: *"Run me again whenever something feels off, after hand-editing files, or before a machine migration."*

## Anti-patterns

**Fixing silently** — every write is announced first; trust in this directory is the product. **Alarmism** — an empty directory or unused feature is not a warning; only flag what would lose data or break a skill. **Backup nagging beyond once** per run.

## Composition

`start` / `user-profile` — where to send a user with no data directory. `weekly` — a healthy directory is what makes the weekly ritual's scans trustworthy. Stakeholder lifecycle changes (archiving, renames) belong to the stakeholder pack's manage skill, if installed — don't guess at them here.
