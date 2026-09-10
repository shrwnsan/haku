# For Senior ICs

You do the work that makes the team function—the design reviews, the onboarding, the "quick question" that saves someone two days—and then watch the promotion packet ask for "technical accomplishments" as if none of that happened. Staff+ progression runs on influence, visibility, and evidence, and all three are things engineers are told to feel vaguely embarrassed about pursuing. The quiet fear: doing career-defining work that no one, including future-you, can point to.

haku is the pointing-to system.

## Your starter kit

The people pack covers the influence skills; glue-audit ships in leadership: `scripts/install.sh --pack people --pack leadership`. Five skills. The rest will find you when a situation matches.

| | When it fires | What it does for you |
|---|---|---|
| `/haku:wins-log` (core) | "I shipped X" / "I unblocked Y" / "I talked us out of Z" | Structured capture—situation, action, impact, evidence—while the details are fresh. The raw material for every future promo packet, self-eval, and interview story. |
| `glue-audit` (leadership) | "Where does my time actually go?" | Catalogs and quantifies your non-core work—mentoring, docs, unblocking—with a promotion-value read and a fairness check. Makes the invisible third of your job legible. |
| `influence-without-authority` (people) | Driving an architecture change across teams | The staff+ core skill: coalitions, interests vs. positions, pushing back on a principal without burning the relationship. |
| `the-rfc-reviewer` (core agent) | Before you publish the design doc | A senior-staff-grade review of your own RFC—gaps, unstated assumptions, the objection you haven't pre-empted—before your reviewers find them for you. |
| `/haku:weekly` (core) | Friday, 15 minutes | Wins captured, one stakeholder reflected on (yes, ICs have stakeholders—your manager, your skip, the peer team's tech lead), patterns surfaced. |

## A week with haku

**Tuesday.** You spend half a day helping the new hire trace a gnarly race condition. Old you: that half-day evaporates. New you: thirty seconds Friday logging it (category: mentorship, evidence: their PR merged next morning).

**Wednesday.** Your cross-team proposal to consolidate the two event pipelines needs the other team's lead on side, and he's skeptical. `influence-without-authority` reframes: his stated position is "too risky this quarter"; his interest is not being left holding the migration pager. Address the interest, not the position.

**Thursday.** RFC draft done. `the-rfc-reviewer` finds the rollback section is hand-waving and the capacity math assumes a peak that contradicts your own graph. Better you find it than the principal engineer does, in public.

**Friday, 3pm.** `/haku:weekly`. Three wins logged in five minutes. A pattern: this is the fourth week running that reactive support work displaced your promo-critical project. That's not a mood—it's cited, dated evidence for the workload conversation with your manager. `glue-audit` can turn it into numbers when you're ready.

## When you're ready for more

- **The packet:** `wins-curate` (people pack) remixes the log into a promo case, STAR interview stories, or a self-eval; `promo-case-glue` specifically frames glue work as technical leadership.
- **Career direction:** `the-career-coach` (people pack) for the honest staff-vs-management-vs-depth conversation with yourself.
- **First-time setup:** run `/haku:start`—profile, one stakeholder, this kit. See [Install](../install.md) and [Core](../core.md).
