---
title: "Data & privacy"
---

# Data & privacy

## Where your data lives

Everything haku remembers lives in one local directory:

```
~/haku-work-reflections/
└── profile.md        # your anchor file, created by /haku:user-profile
```

It stays on your machine—no sync, no telemetry, no cloud component. Override the location with `$HAKU_WORK_REFLECTIONS_HOME` (e.g. an encrypted volume); the skills respect it everywhere.

## Backups

`doctor` checks whether the directory is a git repo with a remote, and when it last committed. If not, it offers:

- **Snapshot** — `tar -czf ~/haku-backup-YYYY-MM-DD.tar.gz -C ~ haku-work-reflections`
- **Versioning** — `git init` + first commit. Any remote must be **private**: pushing sends your reflections to that host. Your call.

A backup older than ~30 days of new entries gets flagged.

## Migrating machines

Run `doctor` on the new machine—it validates the directory layout, catches orphans and drift, and proposes fixes before they cost data.

## From bettersense

If `~/bettersense-work-reflections/` exists (a pre-rename root), setup and `doctor` surface it and offer a `mv` to `~/haku-work-reflections/` (or point `$HAKU_WORK_REFLECTIONS_HOME` at the old path). Don't run fresh alongside an old root—a second root silently forks your memory. Uninstallers also clean up legacy `bettersense`-named symlinks.

## The privacy posture

One deliberate stance: **capture-is-the-sensor**. haku has no ambient telemetry—nobody reports a routing miss unless someone logs it via `capture`. What you win, decide, and reflect on is yours; nothing leaves the directory unless you push a backup yourself.
