# Bounded control experiment — RAVEL iteration receipt (2026-11-27)

Status: isolated executable prototype, not a new Skill-Workshop release, not a Research OS migration.

## Discover / Plan
The design study 02 compares native reasoning, conditional pipelines, and adaptive composition. The first executable witness should be small enough to falsify the control policy rather than create infrastructure for its own sake.

Decision ratings are provisional reviewer judgments in [0,1], not calibrated probabilities. R = relevance to research objective, F = feasibility in current environment, V = expected decision value, E = strength of evidence available for the choice, B = burden (higher is worse). Do not aggregate these into authority or truth. Hard gates precede ranking.

| Decision | R | F | V | E | B | Disposition |
|---|---:|---:|---:|---:|---:|---|
| Isolated synchronous JS experiment | .96 | .99 | .92 | .80 | .12 | implement |
| Full graph compiler and planner service | .75 | .48 | .58 | .32 | .90 | defer |
| Separate admission from ranking | 1.00 | .98 | .99 | .91 | .10 | implement |
| Immutable goal and bounded attempts | 1.00 | .99 | .98 | .94 | .08 | implement |
| Persist mandatory IDs independently of proposals | 1.00 | .98 | .99 | .96 | .10 | repair |
| Allow callbacks to write external state | .65 | .60 | .50 | .30 | .85 | reject in this prototype |
| Preserve legacy 21 names as tested contracts | .99 | .67 | .97 | .55 | .56 | defer live migration |
| Release after synthetic tests | .35 | .86 | .25 | .10 | .50 | reject |

## Execute / Verify
- controller.mjs implements bounded propose/admit/rank/execute/observe/replan.
- The ranking is a deliberately simple heuristic: (1 + value * confidence * relevance - burden)/2. A nonmandatory score must exceed 0.5. Mandatory work bypasses preference ranking threshold, never hard admission.
- Initial 16 cases passed when the same JavaScript function and check bodies were executed in a V8 isolate. The next revision added four adversarial cases and passed 20/20. These are synthetic functional witnesses, not LLM effectiveness results.
- Run independently: `node experiments/bounded-control/controller.test.mjs`.

## Iterate
Initial defect: a mandatory action could disappear from a later candidate list or a partial output could be considered verified. Added explicit requiredActions, persistent obligations, complete declared output checking for mandatory actions, and a pending list returned at termination. Score validation rejects NaN and scores outside the unit interval.

Remaining defects/limits: action IDs and prerequisite facts are strings, not typed semantic ports. Mandatory action identity is retained but its full contract is not frozen; a trusted proposer can still change its declared output. Authority and verification are provided by trusted synchronous callbacks, not independently derived. No security sandbox, elapsed-time bound, parallel tool execution, persistence, source authentication, independent scientific verifier or evidence graph. Cost is a synthetic reserved integer, not metered runtime cost. Origin review uses two iterations without novel fact tokens as a crude trigger, not a validated measure of scientific progress. The controller does not claim task completion; it reports why it stopped and outstanding obligations. The conservative mandatory-first rule may HOLD even when an optional prerequisite could unblock it.

Next evaluation: freeze contracts independently of proposals; test necessary prerequisite planning under a budget, and compare against fixed/direct strategies on held-out task traces. No Research OS migration until live consumer equivalence is established.
