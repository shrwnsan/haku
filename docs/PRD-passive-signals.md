---
title: "PRD (parked): passive signals for the weekly loop"
---

# PRD (parked): passive signals for the weekly loop

**Status: PARKED — what's-next bucket. Do not start until a trigger in §5 fires.**

**Origin:** the AI-native SDLC playbook closes its loop with ambient telemetry; haku shipped v1.1 on the opposite bet — capture-is-the-sensor. This PRD holds the middle path for later, so the idea neither gets relitigated from scratch nor silently built.

## 1. Problem

The weekly loop trusts the user to remember and capture. Skip-weeks and empty wins-logs are the known failure mode — capture friction is the tax v1.1 accepted in exchange for zero context-hungry telemetry. Real usage may prove that tax too high.

## 2. Proposal (hypothesis, not commitment)

An opt-in passive-signal layer that reads data exhaust the user already produces and drafts the weekly review:

- git history from repos the user names (commits, branches, merge cadence)
- PRs and issues via `gh` (shipped, reviewed, merged)
- activity already inside haku's own artifacts (decisions logged, specs written)
- hooks from feat/gates-hooks as the collector substrate — deterministic, local, no network

Output: a draft weekly + wins-log candidates the user edits. Never auto-commits.

## 3. Non-goals (v1.1 stands)

- No ambient behavioral tracking, session surveillance, or screen-level observation.
- No network telemetry, cloud analytics, or third-party SDKs.
- No cross-user benchmarking.
- Nothing runs without explicit opt-in; nothing writes without review.

## 4. Fit with the playbook story

This is the demoable "loop closes" moment — monitoring signals drafting the next intent, the playbook's final stage realized without instrumentation.

## 5. Right-time triggers (any one)

1. **Evidence:** a post-ship cohort of weekly users shows capture friction — skipped weeks, empty wins, or "I forgot what we did" as the top retro/issue complaint.
2. **Technical:** feat/gates-hooks merged — the hook machinery is the collector substrate; building before it means building twice.
3. **Strategic:** a launch/folio moment needs the full playbook loop demoed end-to-end.

Earliest realistic window: after v0.5 (core-slim + gates-hooks + body-diet all merged). Before that, the loop itself isn't trustworthy enough for a sensor layer to amplify.

## 6. Success, if built

- Weekly review drafting time down; weeks-skipped down.
- Zero new permissions, zero network egress.
- Manual capture stays first-class; passive signals only draft, never decide.
