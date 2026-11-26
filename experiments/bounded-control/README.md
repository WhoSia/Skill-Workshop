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

## RAVEL iteration 02 — prerequisite composition (2026-11-27)

Discover: the previous controller could HOLD on a mandatory action even when optional prerequisites would make it executable; a proposal could also redefine a required action's declared contract. Plan: test a narrow finite monotone planning model before introducing a general workflow compiler.

| Choice | Relevance | Feasibility | Decision value | Evidence | Burden (high = worse) | Verdict |
|---|---:|---:|---:|---:|---:|---|
| Freeze owner-supplied action contracts, separate mutable scores | 1.00 | .98 | .99 | .93 | .15 | implement |
| Exact bounded subset search for required actions | .98 | .94 | .96 | .85 | .25 | implement |
| Treat costs as positive additive integers | .90 | .99 | .86 | .78 | .06 | experiment assumption |
| Use scores to break equal-cost choices, not override hard gates | .99 | .99 | .93 | .89 | .09 | implement |
| Replan after failed prerequisite, charge its reserved cost | .99 | .97 | .98 | .90 | .17 | implement |
| Full stochastic, nonmonotone, parallel planner now | .83 | .42 | .74 | .35 | .88 | defer |
| Migrate Research OS consumers now | .55 | .35 | .38 | .18 | .80 | HOLD |

Ratings are reviewer judgments, not measured probabilities. Execute: `obligation-planner.mjs` and `obligation-planner.test.mjs`. Verify: 19 named functional witnesses and 240 generated comparisons with a separate exhaustive permutation oracle, all passed in V8. Independent CLI run: `node experiments/bounded-control/obligation-planner.test.mjs`.

For a fixed catalog of n actions with monotone additive facts, each executed subset determines the resulting facts, cost and step count independently of execution order. Therefore memoization by subset is valid for the stipulated model. Up to 2^n subsets and O(n 2^n) candidate transitions may be explored (excluding fact processing and plan storage). The hard state cap returns HOLD without asserting an optimum. A new action has positive cost and can be removed from a plan if it neither satisfies an outstanding obligation nor adds a fact. Scores only choose among equal-cost plans.

Iterate: the new module is deliberately separate from the earlier prototype. It is not a complete replacement for optional exploratory control; it handles a fixed mandatory goal set. It assumes successful deterministic declared outputs for planning and replans on actual failure. Contract snapshots freeze the fields used by the algorithm, but do not prove factual validity. Callbacks and owner-supplied registry are trusted; no security isolation, metered cost, freshness, scope typing, invalidation, real consumer equivalence, or production promotion. The finite oracle tests do not demonstrate LLM performance. Next: typed evidence ports and local invalidation, plus cost-aware comparison against greedy prerequisite planning. A relevant complexity reference is Bylander (1994), The Computational Complexity of Propositional STRIPS Planning, https://doi.org/10.1016/0004-3702(94)90081-7; the experiment is a restricted monotone case, not a general STRIPS solver.

## RAVEL iteration 03 — incremental evidence eligibility (2026-11-27)

Status: isolated experiment; no consumer migration or release. The historical instruction is to dynamically compose useful methods, not to maximize the number of skills, validation stages, or infrastructure components.

Discover: the previous planner stores bare additive fact tokens. A source can expire, be withdrawn, or acquire a new revision without changing its Boolean eligibility. A dependent decision must not silently inherit an outdated provenance witness. Conversely, deleting every reachable descendant over-invalidates nodes with alternative support. The fixed-DAG evidence index is a minimal test of this distinction.

| Design choice | R | F | V | E | B (high = worse) | Disposition |
|---|---:|---:|---:|---:|---:|---|
| Exact identity, revision and scope on ports | 1.00 | .98 | .96 | .92 | .12 | test |
| Alternative sufficient dependency sets | .99 | .97 | .98 | .93 | .16 | test |
| Propagate lineage changes even if eligibility survives | 1.00 | .99 | .98 | .96 | .12 | test |
| Monotonic explicit logical clock and atomic input validation | .95 | .99 | .91 | .89 | .09 | test |
| Full authority/type lattice, authentication and proof semantics | .98 | .56 | .92 | .60 | .80 | defer until consumer witnesses |
| Immediate integration with obligation planner | .92 | .71 | .85 | .58 | .44 | hold: distinguish eligibility from execution certification |
| Native implementation or heap optimization now | .54 | .90 | .45 | .24 | .28 | defer: no measured hot path |

Ratings are provisional reviewer judgments, not probabilities or empirical effect sizes. R=relevance, F=feasibility, V=expected decision value, E=available evidence, B=burden. Admission remains a hard gate.

Execute: `evidence-index.mjs` and `evidence-index.test.mjs`. A fixed, topologically ordered graph has externally admitted roots with exact revision, declared scope, and optional exclusive expiry. A derived node has nonempty alternative conjunctions of earlier typed ports. A batch validates before mutating input; changed eligibility, active alternative indices or lineage trigger reverse-edge propagation. A revision change propagates even if eligibility remains true. Output lineage is a union of currently eligible root/revision pairs, NOT independent corroboration, a minimal support set, proof, or scientific authority. Output scope is a trusted declaration; exact edge matching does not certify semantic narrowing or widening. Root admission, version authenticity and sufficiency rules are trusted inputs.

Verify: 12 targeted assertions plus 1,200 generated update assertions (300 graphs, four updates each; 8 roots, 32 derived nodes; deterministic seed 20261127). The incremental implementation agreed with a separately written full topological reconstruction on eligibility, active alternative indices and root/revision union. Derived-rule evaluations: 18,679 vs 38,400 (51.36% fewer). Both algorithms must also inspect roots; 9,600 root checks in the incremental run. This is a synthetic operation-count comparison, not measured wall-clock speed or LLM effectiveness. V8 test executed before commit; fetched GitHub content was exactly equal to the tested source and test text, excluding the corrected oracle comment. Independent CLI execution remains open: `node experiments/bounded-control/evidence-index.test.mjs`.

Iterate: distinguish STRUCTURAL_ELIGIBILITY_ONLY from actual verification of a new research result. A source revision may preserve a structural route while invalidating an execution certificate bound to old evidence. Re-execution must therefore be driven by a separate certificate/dependency receipt. No scientific promotion by recomputation. No cyclic graph, open-world semantics, authority widening, clock synchronization, real source resolution, or durable persistence in this experiment. Root scans and Set minimum selection are intentionally simple; profile before introducing indexed timers or a priority queue. A full recomputation may be cheaper for dense or small graphs. Do not grow the evidence engine before demonstrating a controller-facing counterexample: stale certificate versus unchanged eligibility, followed by actual local replanning.

Origin return edge: this is ENABLING, not evidence of superior research intelligence. Next compare an adaptive composition against direct reasoning/fixed planning on a task trace where a critique changes the decision, and test only the additional contract required by that trace. Preserve 2.4.4 and Research OS consumers unchanged. No GitHub Actions used.
