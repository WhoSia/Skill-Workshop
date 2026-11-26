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

## RAVEL iteration 04 — decision-aware method composition (2026-11-27)

Status: finite model experiment; not a new runtime, LLM performance result, or Research OS migration.

Discover: the controller's independent candidate score cannot represent a method that has no immediate decision benefit but enables a useful second method. Conversely, a costly orchestration layer is unnecessary if direct reasoning or a greedy choice is adequate. Study decision utility rather than raw novelty or amount of acquired information.

| Design decision | R | F | V | E | B (high = worse) | Disposition |
|---|---:|---:|---:|---:|---:|---|
| Explicit direct/no-method option | 1.00 | .99 | .98 | .97 | .03 | test |
| Equal worst-case budget for fixed, greedy and adaptive policies | 1.00 | .98 | .99 | .94 | .08 | test |
| Finite deterministic observation model | .96 | .99 | .88 | .85 | .12 | test |
| Exhaustive adaptive optimum as reference, not default runtime | .98 | .94 | .95 | .90 | .25 | test |
| Positive marginal-utility greedy policy as inexpensive rival | .99 | .99 | .95 | .92 | .08 | test |
| Always invoke exact adaptive planning | .62 | .70 | .45 | .30 | .78 | reject |
| Learn outcome models from real task traces | 1.00 | .68 | .99 | .72 | .48 | next |
| General stochastic/continuous planner before empirical tasks | .70 | .40 | .55 | .32 | .90 | defer |

R=relevance, F=feasibility, V=expected decision value, E=available evidence, B=burden; judgments, not calibrated probabilities.

Model: finite weighted possible worlds, each with a correct decision; each admitted optional method has a fixed positive integer cost and a deterministic observation in each world. Stop chooses the maximum posterior decision mass (0-1 loss). Utility = expected correctness minus penalty times expected cost; every realized path obeys the same hard budget. Compare direct stop, optimal nonadaptive fixed subset (all selected methods executed), one-step greedy adaptive selection with stopping, and exact adaptive selection with stopping. The exact recursion partitions the surviving worlds by the observation and recurses on the remaining methods and budget. No method reuse; unadmitted methods excluded. The fixed baseline cannot stop early or branch; the greedy baseline can. Neither the correctness labels nor outcome model are learned or independently verified.

Execute: `method-composition.mjs` and `method-composition.test.mjs`. Run `node experiments/bounded-control/method-composition.test.mjs`.

Verify: 905 assertions in V8, including 300 generated finite problems (5 worlds, 4 methods, seed 20261127). Exact adaptive utility agreed with a separate un-memoized array-based exhaustive recursion, and policy replay agreed with the exact policy objective. Two constructive witnesses:

- Conditional specialization, four equally likely decisions, two unit-cost actions maximum, zero penalty: direct .25, optimal fixed .75, greedy adaptive 1.00, exact adaptive 1.00. Branching helps, expensive lookahead does not.
- XOR, four equally likely worlds, two bits jointly determine the binary decision, unit cost, penalty .04: direct .50, fixed .92, greedy .50, exact adaptive .92. The individual observations have zero immediate decision value, but the pair is valuable; fixed composition is already adequate.

Generated cohort: exact strictly beat fixed in 112/300 and greedy in 49/300; stopped without a method in 16/300. Mean exact-minus-greedy utility .0087899152. These frequencies characterize the chosen artificial generator only, not real tasks. No measured compute/latency overhead, model performance, or calibrated priors. The exact planner is bounded to 16 worlds and 10 methods, with exponential search in method count; the numeric implementation uses floating-point comparisons with tolerance, not formal real arithmetic. Greedy policy node utility stores its one-step estimate; the top-level replay utility evaluates the whole realized greedy policy.

Iterate: the main negative result is that adaptive optimality alone does not justify always running lookahead. Conditional routing, joint complementarity and cheap stopping are separate design choices. An expressive controller needs an estimate of model uncertainty and planning overhead; when these are not reliable, use direct reasoning or simple routing and treat the finite solver as an oracle on declared models. Next create a small, prospectively frozen set of research task traces, distinguish outcome-model misspecification from method-selection error, and compare cost-adjusted external outcomes. No expansion into a general planner until a concrete task warrants it. Origin classification: ENABLING, return edge = observed improvement over native/fixed baselines on research work. Existing controller, obligation planner, evidence index, 2.4.4 and Research OS remain unchanged. No GitHub Actions used.

## RAVEL iteration 05 — rival coverage and contrast reversal (2026-11-27)

Status: retrospective method-transfer experiment; not a calibrated router or production migration. Internal research records were consulted on an authorized private surface; no private source pages, participant data, or unpublished measurements are copied into this public repository. Generic fixtures below are synthetic.

Discover: a method may change a decision by adding a missing comparator, replacing an inadequate null, or separating an estimand from its surrogate. Prior retrospective and follow-up records distinguish changed action selection from demonstrated improvement in scientific outcomes. A fixed scoring system cannot infer the strength of an omitted rival from a high implementation score.

Plan: a minimal reusable operator rather than another orchestration layer. Freeze the target, direction of preference, comparator roster and scope. For each admitted comparable rival, compute an oriented contrast. Return missing/incompatible rivals, contrast range, sign and a proposed next action. A sign reversal prevents a blanket direction claim; missing comparators are still visible even when a reversal has already been witnessed. Additional rivals are listed separately and do not silently alter a frozen roster. Scope labels and roster are caller-supplied, not independently verified. The result is descriptive and does not yield p-values, causal estimates, a confidence interval, or proof that the roster is sufficient.

| Decision | R | F | V | E | B (higher = worse) | Disposition |
|---|---:|---:|---:|---:|---:|---|
| Extract method triggers from real research histories | 1.00 | .95 | .99 | .90 | .25 | retain |
| Preserve a missing comparator as an explicit state | .99 | .99 | .97 | .92 | .07 | test |
| Report contrast direction conditional on rival | 1.00 | .99 | .98 | .93 | .06 | test |
| Use a fixed roster as proof of rival sufficiency | .35 | .99 | .20 | .05 | .05 | reject |
| Train a router on retrospectively hand-labelled cases and report its test accuracy on those cases | .69 | .95 | .21 | .10 | .30 | reject |
| Prospective decision/action/outcome comparison with native baseline | 1.00 | .75 | 1.00 | .79 | .47 | next |

Scores are provisional judgment, not measured probability. R=relevance, F=feasibility, V=expected decision value, E=available evidence, B=burden.

Execute: `contrast-audit.mjs` and `contrast-audit.test.mjs`. Run `node experiments/bounded-control/contrast-audit.test.mjs`.

Verify: 1,512 assertions in V8, including 500 generated fixtures with independent extrema and permutation checks; 12 targeted cases cover missing/incompatible/extra comparators, orientation, ties and invalid values. Separately applied the operator to three already-exposed aggregate historical comparisons on the private research surface: two had opposite signs across the declared rivals, one did not improve on its baseline. These are arithmetic reconstructions of reported results, not raw-data reruns, independent evaluation, or newly discovered lab outcomes. The exact tested code and test text were fetched back after commit. No wall-clock benchmark or native CLI run was performed. No GitHub Actions used.

Iterate: the reusable pattern is conditional contrast, not a new mandatory stage. Stronger-rival discovery and scope matching still need substantive domain judgment; the operator only makes consequences inspectable after the inputs are supplied. Future prospective task trials should record the native plan before exposing method advice, then measure plan changes, executed actions, actual outcomes, and extra cost separately. A historical case that informed design is development-only and cannot be used as unseen validation. Include cases where the native plan is already adequate and the intervention should be omitted. Preserve the existing 2.4.4 distribution and Research OS consumer contracts. Origin classification: ENABLING, with return edge to demonstrated decision changes on genuine research tasks.
