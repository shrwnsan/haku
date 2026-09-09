# LEAN-PLAN — bettersense v2 architecture

Status: plan (Gilfoyle round 2 conditional sign-off; the three blocking artifacts below are now landed: §3 disposition table, §4 hook predicates, §5 gate contracts).

Branch model: `main` tracks `upstream/main` (shwetank/bettersense) — never diverges, fast-forward only. `lean` is the integration branch for this redesign. Feature work happens on `feat/*` branches in git worktrees, merged into `lean`.

## 1. Thesis

The plugin's value is not its 54 skills — it is four mechanisms: routing evals, compounding memory (user-profile), starter-kit onboarding, cadence monitors. Everything else is content, and content has a context tax paid on every session.

The AI-native SDLC has moved the bottleneck from writing to deciding: intent → spec with acceptance criteria (= eval cases) → constrained execution → eval-gated merge → progressive delivery → telemetry → next intent. Humans sit at decision points; governance is hooks-as-gates. A leadership plugin shaped for that world is not a bigger library of frameworks — it is a small core that runs the decide→spec→evidence loop, with optional packs bolted on per role.

So: slim to an 8-skill core + 5 gate agents, convert the remaining 68 items into opt-in packs, replace process skills with deterministic hooks where possible, and put every body on a word diet.

## 2. Target architecture

**Core (always installed):**

- Skills (8): `start`, `user-profile`, `capture`, `decision-log`, `strategy-doc`, `wins-log`, `weekly`, `doctor`
- Agents (5): `the-reducer` (intent gate), `the-spec-writer` (spec author), `the-red-teamer` (spec gate), `the-rfc-reviewer` (review gate), `the-retro-facilitator` (retro, inside `weekly`)
- Convention: `gates/<name>/gate.md` (§5)
- Hook: `ship-review` pre-merge predicate (§4)
- Budget: core ≤ 10,000 words total; every skill body ≤ 800 words; every description ≤ 60 words

**Packs (opt-in, installed as a unit, bring their own eval cases):**

| Pack | Contents |
|------|----------|
| `people` | 15 skills + the-career-coach |
| `stakeholder` | 5 skills |
| `team` | 9 skills |
| `comms` | 5 skills + 4 agents |
| `leadership` | 10 skills + the-architect |
| `engineering-ops` | 5 agents (incident, postmortem, program, SLO, vendor) |
| `research` | 3 agents (discovery, gtm, research-synthesis) |
| `evals` | 3 agents (eval-designer, prompt-critic, scientist) |

`doctor` becomes pack-aware: reports installed packs, flags packs whose eval cases stopped running, warns when a core gate is missing.

**Deleted:** 2 skills (§3). Everything else has a pack home — nothing else is deleted in v2.

**Monitors:** keep `check-wins-cadence` (14-day). Drop the rest until a pack needs one.

## 3. Disposition table (76 rows)

Legend: CORE / pack name / DELETE. One-line rationale each.

### Skills (54)

| # | Skill | Disposition | Rationale |
|---|-------|-------------|-----------|
| 1 | ai-pm-frameworks | DELETE | static reference corpus; pure context tax, no routing payoff |
| 2 | capture | CORE | front of the intent chain; every engagement starts here |
| 3 | career-retro | people | periodic reflection; cadence-driven, low frequency |
| 4 | coaching-mode | people | a mode, not pipeline; opt-in via pack |
| 5 | commitments | people | promise tracking; feeds weekly + promo evidence |
| 6 | decision-log | CORE | durable artifact every gate writes to; hook predicate anchors on it |
| 7 | demo-prep | comms | event-driven prep; too rare for core |
| 8 | doctor | CORE | health check; becomes pack-aware gate reporter |
| 9 | engineering-health | leadership | team metrics review; cadence item, not pipeline |
| 10 | exec-readout-prep | comms | high-value but episodic |
| 11 | feedback-frameworks | people | reference behind feedback flows |
| 12 | glue-audit | leadership | audit glue work; periodic |
| 13 | hiring-craft | people | episodic hiring support |
| 14 | impact-audit | leadership | quarterly-style audit |
| 15 | influence-without-authority | people | framework reference |
| 16 | leadership-os | leadership | umbrella meta-skill; pack entry point |
| 17 | manage-glue-workers | leadership | pairs glue-audit |
| 18 | metrics-design | leadership | design-time, not run-time |
| 19 | model-migration-planner | DELETE | one-off niche; vendor-evaluator agent covers the pattern |
| 20 | one-on-one-prep | people | recurring 1:1 prep |
| 21 | patterns-watch | leadership | observation cadence |
| 22 | performance-management | people | cycle-driven |
| 23 | premortem | leadership | decision-quality; complements red-teamer gate |
| 24 | prioritization-frameworks | leadership | reference |
| 25 | product-pulse | comms | status digest |
| 26 | promo-case-glue | people | promo assembly; consumes wins-log |
| 27 | psychological-safety | team | team-health lens |
| 28 | pulse-synthesize | comms | synthesis behind pulses |
| 29 | read-the-room | comms | audience calibration |
| 30 | report-career-architect | people | report generator |
| 31 | report-promo-case | people | report generator |
| 32 | self-reflect | people | personal retro |
| 33 | stakeholder-due | stakeholder | cadence trigger |
| 34 | stakeholder-manage | stakeholder | ongoing management |
| 35 | stakeholder-reflect | stakeholder | periodic review |
| 36 | stakeholder-register | stakeholder | registry artifact |
| 37 | stakeholder-synthesize | stakeholder | synthesis step |
| 38 | start | CORE | onboarding entry; installs the operating loop |
| 39 | strategy-doc | CORE | spec anchor; the-spec-writer consumes it |
| 40 | team-charter | team | artifact skill |
| 41 | team-check-in | team | cadence |
| 42 | team-close-gap | team | remediation flow |
| 43 | team-diagnosis | team | diagnostic |
| 44 | team-lifecycle | team | lifecycle stages |
| 45 | team-style-inventory | team | assessment |
| 46 | team-workspace | team | workspace setup |
| 47 | tech-strategy-writer | leadership | long-form doc writer |
| 48 | user-profile | CORE | persistent context feeding all routing; compounding memory |
| 49 | visibility-sponsorship | people | career lever |
| 50 | weekly | CORE | operating cadence; runs retro + wins-due |
| 51 | wins-curate | people | curates raw wins into case narratives |
| 52 | wins-due | people | cadence trigger for log/curate |
| 53 | wins-log | CORE | evidence-before-merges; outcomes captured as they land |
| 54 | workload-equity | team | distribution check |

Core skills: 8. ✓

### Agents (22)

| # | Agent | Disposition | Rationale |
|---|-------|-------------|-----------|
| 55 | the-architect | leadership | system-design review, on demand |
| 56 | the-career-coach | people | career conversations |
| 57 | the-data-storyteller | comms | narrative from metrics |
| 58 | the-discovery-facilitator | research | discovery interviews; its must-fire eval case moves with the pack |
| 59 | the-eval-designer | evals | experiment/eval design |
| 60 | the-explainer | comms | plain-language translation |
| 61 | the-gtm-planner | research | launch planning |
| 62 | the-incident-responder | engineering-ops | live incident support; must-fire case moves with pack |
| 63 | the-postmortem-facilitator | engineering-ops | blameless postmortems; must-fire case moves with pack |
| 64 | the-program-manager | engineering-ops | cross-team execution |
| 65 | the-prompt-critic | evals | critiques LLM artifacts |
| 66 | the-red-teamer | CORE GATE | spec gate — attacks the spec before build (§5) |
| 67 | the-reducer | CORE GATE | intent gate — compresses ask to intent + acceptance criteria (§5) |
| 68 | the-research-synthesizer | research | cross-source synthesis |
| 69 | the-retro-facilitator | CORE | retro inside weekly; closes loop to next intent |
| 70 | the-rfc-reviewer | CORE GATE | review gate — checks artifacts against standards (§5) |
| 71 | the-scientist | evals | experiment rigor |
| 72 | the-slo-designer | engineering-ops | reliability targets |
| 73 | the-spec-writer | CORE | intent → spec with acceptance criteria = eval cases |
| 74 | the-status-crafter | comms | status updates |
| 75 | the-translator | comms | audience adaptation |
| 76 | the-vendor-evaluator | engineering-ops | vendor/tool assessment |

Core agents: 5 (3 merge gates + spec author + retro). ✓ 54 + 22 = 76 rows accounted for. ✓

## 4. Ship-review hook — deterministic predicates

The hook runs pre-merge (CI job + local PreToolUse on `git commit`). Deterministic parts only — no LLM in the hook:

- **P1 decision reference:** `git diff base...HEAD` patch must contain an added line referencing a decision-log entry (`decisions/[0-9]{4}` or the repo's decision-ID pattern). Fail → "changeset cites no decision."
- **P2 eval parity:** if changed paths match `plugin/skills/*/SKILL.md` or `plugin/agents/*.md` (including descriptions), then changed paths must also match `evals/` (`cases.jsonl` or `rubrics.md`). Fail → "routing surface changed without eval update."
- **P3 flag/shadow tokens:** any added line containing a `FLAG:` or `SHADOW:` token must have that same token present in the spec doc referenced by the decision-log entry. Fail → "behavior behind a flag not declared in spec."
- **P4 dry-run gate (existing):** `node evals/routing/run-routing.mjs --dry-run` exits non-zero → block.

Judgment work — quality of the decision, red-team depth, RFC review substance — is NOT in the hook. It runs as CI jobs invoking the gate agents under the bounded contracts in §5.

## 5. Gate contracts (`gates/<name>/gate.md`)

Every gate file declares the same five fields; a gate without a contract does not run.

```markdown
# gate: <name>
trigger:   <stage that fires this gate, e.g. "intent accepted, before spec work begins">
agent:     <core agent that executes the gate>
inputs:    <artifacts read, e.g. capture output, decision-log entry>
pass:      <objective criteria, e.g. "intent ≤ 50 words; ≥ 1 measurable acceptance criterion; scope deltas deferred to new intents">
rounds:    2   # max revise loops; third strike = escalate
exit:      <artifact written, e.g. "decision-log entry updated with gate verdict">
failure:   <path, e.g. "proceed-with-exception requires human sign-off recorded in decision-log">
```

| Gate | Stage | Agent | Essence of `pass` |
|------|-------|-------|-------------------|
| intent | ask → intent | the-reducer | intent compressed, measurable acceptance criteria exist, out-of-scope explicitly deferred |
| spec | intent → spec | the-red-teamer | every acceptance criterion is testable; failure modes listed; flag/shadow tokens declared |
| review | spec → merge | the-rfc-reviewer | spec matches strategy-doc constraints; eval cases cover each criterion; evidence (wins-log) referenced |

Retro is not a merge gate — it runs inside `weekly` (the-retro-facilitator) and feeds the next intent.

## 6. Execution plan

Worktrees off `lean`, one feat branch per worker, merged back in order:

1. `feat/packs` — mechanical moves per §3; pack manifests; pack-scoped eval case splits. No prose edits.
2. `feat/core-slim` — rewrite the 8 core skills to budget (≤800w each, ≤10K total); doctor pack-awareness.
3. `feat/gates-hooks` — `gates/*/gate.md` contracts + ship-review hook (P1–P4) + CI wiring.
4. `feat/body-diet` — pack skills and remaining agents to ≤800w bodies / ≤60w descriptions.

Gate for every branch: routing suite green before and after (`run-routing.mjs --dry-run`), must-fire cases for moved agents still fire with their pack installed.

## 7. Acceptance metrics

- Install surface: default = 8 skills + 5 agents (was 54 + 22).
- Word budget: core ≤ 10K words (was ~94K across skills+agents).
- Routing: core must-fire/must-not-fire precision and recall unchanged vs `main`.
- Every merge on `lean` cites a decision, passes parity + dry-run predicates.
