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

## Product iteration 06 — RAVEL candidate 01 and prerequisite pruning (2026-11-27)

Product goal: improve usable skill behavior and end-to-end research efficiency, rather than produce an increasingly large experimental framework. No release number is assigned to this candidate.

The existing obligation planner now computes the backward prerequisite cone of unsatisfied mandatory actions before subset search. Begin at required actions, include every admitted producer of their missing required facts, then repeat over those producers' own missing requirements. Initially available facts require no producer. All alternate producers are preserved; scores cannot prune a prerequisite. In this fixed positive-cost monotone model, any action outside the closure can be removed from a feasible sequence without breaking a retained action's requirements, and removal reduces cost. This is a scoped argument, not a theorem for dynamic contracts, side effects, negative costs or nonmonotone research state. The state limit remains a hard limit; pruning may turn a former search-limit HOLD into a feasible plan.

Actual V8 comparison of the fetched previous source and revised source: original suite 19/19 and 240/240 permutation-oracle comparisons passed; new regression 1,207 assertions (including 600 independent permutation-oracle cases and 600 previous-version status/cost comparisons). On the 600 generated cases, visited states fell from 1,687 to 956, with the same 478 HOLD results in both versions. A constructed three-action chain plus nine irrelevant actions fell from 1,104 visited states to 3. A 20-action fixture (17 irrelevant actions) used 3 states and succeeded under a state cap of 8. These are search-state counts, not wall time or measured model/token performance. The new checked-in regression reruns the independent oracle without requiring the prior source; the historical comparative run used both exact source strings. No CLI or CI execution claimed. Source and test readback matched submitted bytes as text.

`candidates/ravel/SKILL.md` is the first standalone instruction prototype, informed by the historical RAVEL semantic contract and current product direction. It emphasizes native/direct alternatives, conditional method use, strong rivals, minimum sufficient dependency selection, action-changing critique, scoped evidence, frozen evaluation and concise reporting. It preserves process/claim authority separation and does not silently replace an unavailable mandatory capability. No raw 2.4.4 content was imported. This is a new candidate projection, not a byte-identical update, full host package, or demonstrated semantic equivalence.

| Decision | R | F | V | E | B (higher = worse) | Disposition |
|---|---:|---:|---:|---:|---:|---|
| Optimize existing exact monotone planner | 1.00 | .99 | .95 | .96 | .10 | implemented |
| Retain all alternate producers | 1.00 | .99 | .98 | .96 | .06 | implemented |
| Make RAVEL a short usable candidate skill | 1.00 | .97 | .99 | .76 | .18 | prototype |
| Always require deterministic helper | .40 | .65 | .35 | .25 | .64 | reject |
| Compare candidate with exact 2.4.4 and native model | 1.00 | .72 | 1.00 | .90 | .42 | next |
| Release or rename production now | .48 | .50 | .32 | .18 | .65 | hold |

Judgments are not calibrated probabilities. R=relevance, F=feasibility, V=expected product value, E=evidence, B=burden. Existing Research OS consumers and 2.4.4 remain unchanged. Next: verify actual skill activation and output on matched research tasks with direct/legacy/candidate variants, preserve private research data and compare actual resource use. Raw 2.4.4 access and host execution remain unresolved. No GitHub Actions used.

## Product iteration 07 — SCOUT and AXIOM candidate 01 (2026-11-27)

Product objective: reduce redundant retrieval and ineffective mathematical search while preserving decision-relevant evidence and the original research question. Reviewed SCOUT's portable contract, AXIOM's semantic normalization entry, and the cross-domain donor search contract in the owner's authorized research workspace. No private records were copied into this public repository. Neither candidate is a released replacement.

- `candidates/scout/SKILL.md`: 406 whitespace-delimited words. Canonical-first, gap-directed high-recall discovery, source identity/edition, actual access/read status, support/non-support, distinct roots, and explicit unresolved roles. Search discovery has no authority to admit claims. Search breadth is conditional, not ceremonial.
- `candidates/axiom/SKILL.md`: 452 whitespace-delimited words. Explicit domain and quantifiers, exact structure, minimal counterexamples, assumptions, alternative constructions, and proof versus empirical-model boundaries. A failed universal claim cannot be rescued by silent domain mutation.
- `fiber-audit.mjs` and `fiber-audit.test.mjs`: optional finite-domain helper, not a general theorem prover. Given exact string keys for state ID, observation and target, group by observation and compare each subsequent target to the first target in that group. Return a conflicting pair when one exists, count ambiguous fibers, and distinguish enumerated-domain consistency from any claim of complete domain coverage. Under ordinary hash-map assumptions, expected linear work in the number of rows versus quadratic exhaustive pair comparisons. String canonicalization and completeness remain caller obligations.

The structural criterion: for functions O:S→Y and T:S→Z on a declared domain S, T factors through O on O(S) iff every O-fiber has constant T. Necessity follows by applying the same factor to equal observations. Sufficiency defines the factor using the common T value in each nonempty fiber. A single conflicting pair disproves factorization on any domain containing those states. No conflict in a sample establishes consistency on that sample only. This is an elementary known criterion, not a novelty claim.

V8 verification: 1,751 checks; 500 generated cases; 243 conflicting cases; all ambiguity counts matched the independent pairwise oracle, all returned witnesses were valid, and reversal of enumeration preserved the verdict and ambiguity count. Across the generated cohort, 25,919 target-to-representative comparisons versus 1,209,902 state pairs. In a structured 10,000-state fixture with 100 fibers: 9,900 comparisons versus 49,995,000 possible pairs. These are operation counts against a full pairwise enumeration, not timing speedups or a comparison with a short-circuit pairwise witness finder. Hash-map and set operations, key length and memory costs are excluded. CLI invocation: `node experiments/bounded-control/fiber-audit.test.mjs`; not independently run in Node CLI here.

Composition example: RAVEL identifies the decision gap; SCOUT resolves a required source if needed; AXIOM tests a structural proposition only on the admitted formal domain. The presence of all three candidates does not require all three activations. A genuine counterexample can redirect the action immediately; inability to find a source remains a blocker for its required evidence role. No source discovery or finite check grants scientific authority. Do not automatically couple these candidates into a fixed pipeline.

| Decision | R | F | V | E | B (higher = worse) | Disposition |
|---|---:|---:|---:|---:|---:|---|
| Source-gap-first SCOUT | 1.00 | .98 | .98 | .83 | .15 | prototype |
| Preserve access and source identity distinctions | 1.00 | .99 | .99 | .92 | .07 | prototype |
| Structure-first AXIOM with explicit falsifier | 1.00 | .98 | .99 | .87 | .18 | prototype |
| Optional finite fiber checker | .93 | .99 | .89 | .96 | .09 | implemented/tested |
| Make every AXIOM task a fiber analysis | .25 | .99 | .18 | .12 | .50 | reject |
| Force RAVEL→SCOUT→AXIOM on every task | .35 | .99 | .25 | .18 | .55 | reject |
| Live matched candidate/legacy/native task comparison | 1.00 | .68 | 1.00 | .86 | .45 | next |

R=relevance, F=feasibility, V=expected product value, E=evidence, B=burden; provisional reviewer estimates, not calibrated probabilities. Actual model activation, research quality, token/latency and old release equivalence remain unmeasured. Existing 2.4.4 package and consumer contracts unchanged; no Actions used.

## Product iteration 08 — LANTERN and PIVOT candidate 01 (2026-11-27)

Product objective: turn a discovered obstruction into a useful next research action, without treating repeated adversarial review or reframing as automatic progress. Reviewed the historical LANTERN and PIVOT semantic contracts and the frozen four-episode PIVOT shadow router benchmark on the authorized private research surface. The historical labels are design context, not an evaluation of these candidates; the old benchmark was not altered.

- `candidates/lantern/SKILL.md` (374 whitespace-delimited words): targeted admissible counterexamples, rival mechanisms, failure-class separation, nonredundant attacks and next discriminating test. No adjudication authority; absence of a counterexample is not proof.
- `candidates/pivot/SKILL.md` (452 words): representation-sensitive trigger, NO_TRIGGER for missing evidence or changing frozen execution, and explicitly separate SHADOW_ONLY exploration for a future permitted question. Preserve original explanandum, compare against the original representation, never claim outcome improvement from a change of plan.
- `refinement-selector.mjs`: optional exact finite observation design helper. Given a finite enumeration, initial observation and target labels, admitted candidate channels with exact values and positive integral costs, and a budget, find a minimum-cost subset making the target constant on every refined observation fiber. No claim of real-world availability, measurement accuracy, causal identification or domain completeness. At most 12 candidate channels. No adaptive acquisition or repeated channels; costs are declared and additive.

Method: retain only target-mixed observation groups. Split them by each chosen channel; discard pure groups. If a channel is constant on every remaining mixed group, it cannot distinguish a conflicting pair in any subsequent subgroup, so skip it. Search subsets in increasing input index order; a positive-cost extension cannot improve a known solution of equal or lower cost. This is exact on the supplied finite model, with exponential worst-case search in channel count. It is not an optimization of a prior production implementation. Alternate equal-cost plans are not enumerated; the first minimum under traversal order is returned.

Verification: V8 executed 1,591 checks, including 600 generated finite models with independent exhaustive subset-and-pair oracle, returned-plan cost/validity checks and row-order permutation checks. 381/600 have feasible refinements (76 already identified, requiring zero cost); 219/600 have none within the declared candidate set and budget. All 600 agree with the oracle's minimum cost or infeasibility; 2,930 search states visited. These are artificial problem frequencies and deterministic correctness, not measured research quality or a wall-time improvement. A constructive XOR fixture requires two jointly informative unit-cost observations rather than a cost-three full-state observation. A one-unit budget does not suffice. If an unadmitted channel is the only informative one, no plan is returned. CLI: `node experiments/bounded-control/refinement-selector.test.mjs`; this independent CLI path was not run here.

Composition: AXIOM supplies the precise proposition/domain, LANTERN finds a valid conflicting witness, and PIVOT evaluates whether a representation change can preserve the objective while improving the next test. SCOUT is appropriate if the missing distinction requires source acquisition, rather than an encoding change. RAVEL decides whether to continue. None is a mandatory step merely because available. No candidate supplies scientific adjudication.

| Decision | R | F | V | E | B (higher = worse) | Disposition |
|---|---:|---:|---:|---:|---:|---|
| Targeted admissible LANTERN attacks | 1.00 | .98 | .99 | .88 | .18 | prototype |
| Freeze-preserving PIVOT abstention | 1.00 | .99 | .97 | .94 | .09 | prototype |
| Minimum-cost finite refinement helper | .96 | .98 | .94 | .96 | .16 | implemented/tested |
| Treat missing evidence as a representation problem | .30 | .99 | .15 | .10 | .50 | reject |
| Claim live model improvement from synthetic tests | .20 | .99 | .10 | .05 | .08 | reject |
| Prospective comparison of integrated and native behavior | 1.00 | .72 | 1.00 | .86 | .46 | next |

R=relevance, F=feasibility, V=expected product value, E=evidence, B=burden; subjective decision estimates, not calibrated probabilities. Actual activation, model-level quality and resource use, exact legacy comparison and consumer equivalence remain open. Existing 2.4.4 distribution and Research OS unchanged. No GitHub Actions used.

## Priority-driven product loop — evidence freshness, MOSAIC and COURT (2026-11-27)

User direction: continuously reassess priorities, complete the highest-value feasible changes, and score substantive decisions on 0–1 scales rather than opening numbered stages. The objective is measured skill product capability, not growth in helper or document count.

This is a retrospective decision receipt, not a preregistration of the scores. R=relevance, V=expected product benefit, E=evidence, F=execution feasibility, B=burden (larger worse). Proposed ordering heuristic P=.25R+.35V+.15E+.15F+.10(1−B). The weights are a design choice, not empirical calibration. Hard prerequisites, permissions, consumer compatibility and evidence limits remain independent; a blocked high-value task is not executed by lowering its gate.

| Decision | R | V | E | F | B | P | Status |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Evidence read-set freshness repair | 1.00 | 0.99 | 0.97 | 0.98 | 0.20 | 0.969 | done |
| Existing helper composition regression | 1.00 | 0.98 | 0.94 | 0.99 | 0.14 | 0.968 | done |
| Matched evaluation protocol | 1.00 | 0.98 | 0.90 | 0.99 | 0.16 | 0.960 | done |
| MOSAIC/COURT candidates | 0.99 | 0.97 | 0.92 | 0.98 | 0.22 | 0.950 | done |
| Live matched model evaluation | 1.00 | 1.00 | 0.86 | 0.20 | 0.45 | 0.814 | blocked: independent execution surface not found |
| More unrelated helper algorithms | 0.55 | 0.48 | 0.45 | 0.95 | 0.50 | 0.566 | defer |
| Formal production release | 0.70 | 0.55 | 0.22 | 0.30 | 0.75 | 0.470 | blocked |

Evidence index defect: a root expiration extension can leave the structural snapshot and union of root revisions identical even when the active justification has changed. The existing structural snapshot remains backward-compatible as a working projection; new instance-local `capture(ids)` and `isCurrent(token)` support conservative read-set freshness checking. Each eligible node carries an opaque stamp that is replaced on structural changes or changes to active dependency stamps and root metadata. Unchanged independent branches retain their stamps; tokens cannot be reused across index instances, serialized as durable certificates, or revived after a change and reversal. Caller-declared admission remains trusted; tokens do not certify truth, prove semantic equivalence or establish that a particular action actually executed. `certificateChanged` is separate from the prior structural `changed` field.

Actual V8 execution of the previous and revised code: original regression 1,212/1,212 checks on 1,200 updates, identical structural oracle results. New certificate regression 965 checks across 300 generated graphs / 1,200 updates plus targeted cases. Existing generated cohort's derived evaluations increased from 18,679 to 19,825 (6.14% extra versus previous local update) because freshness propagation catches additional relevant changes; still below full 38,400 evaluations. These counts are not timing. This correctness tradeoff is intentional, not claimed as a speedup. New token checking is instance-local only.

MOSAIC and COURT candidate instruction prototypes are now available. MOSAIC: preserve claim-level lineage, shared ancestry, disagreement and unresolved obligations; no new authority by merge. COURT: adjudicate actual claims and criteria rather than engineering surrogates, revalidate changed evidence only, do not impose ceremonial adjudication on exploration. Both are based on historical semantic contracts, not released equivalence. Public repository contains generic instructions, no private research records.

Integration: `composition.test.mjs` uses the actual fetched implementations of fiber audit, refinement selection, obligation planner, evidence index and contrast audit in one synthetic scenario. Eight checks passed, covering a conflicting observation, minimum-cost joint refinement, actual recheck, stale evidence despite unchanged eligibility, rival reversal, omitted strong rival and failure of a required prerequisite. This does not test live model skill selection, autonomous execution or external evidence.

`docs/candidate-evaluation.md` establishes matched native/legacy/candidate/adaptive arms and evaluation boundaries. No independent model execution surface found; exact legacy archive bytes remain unavailable. No model results collected, no production release, no CI invocation. Existing tests executed in V8, not independently in Node CLI.

## Reassessment after completed changes

| Decision | R | V | E | F | B | P | Status |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| CACHE freshness integration | 0.98 | 0.96 | 0.92 | 0.95 | 0.23 | 0.938 | next feasible before package check |
| Portable package and host smoke check | 0.98 | 0.97 | 0.83 | 0.80 | 0.30 | 0.899 | next feasible |
| Additional independent methods | 0.89 | 0.84 | 0.73 | 0.95 | 0.28 | 0.840 | lower priority |
| Recover exact legacy baseline | 1.00 | 0.99 | 0.90 | 0.25 | 0.40 | 0.829 | blocked in current session |
| Run fresh matched model tasks | 1.00 | 1.00 | 0.90 | 0.20 | 0.45 | 0.820 | blocked |
| Candidate revision from observed task failures | 1.00 | 0.99 | 0.50 | 0.35 | 0.25 | 0.799 | await actual outputs |
| Production release | 0.70 | 0.55 | 0.22 | 0.30 | 0.75 | 0.470 | hold |

The next feasible product work is to integrate CACHE freshness, then prepare a portable candidate package and host smoke check without substituting for the legacy release. Actual model comparison remains the highest-value blocked target. Do not keep writing helper algorithms to avoid that bottleneck.

### Priority return edge — CACHE selected before packaging

The initial reassessment's CACHE score (.938) exceeds the portable-package score (.899); no actual dependency requires packaging first. Correct the proposed order rather than follow the earlier handoff mechanically. CACHE's historical contract was reviewed and `candidates/cache/SKILL.md` created (393 whitespace-delimited words): bounded current-state retrieval, exact canonical dependency resolution, selective revalidation, projection coherence, no self-certification, and explicit cross-session limits of instance-local tokens. This is instruction integration, not a measured model-level cache hit-rate improvement.

Reassessment: CACHE instruction prototype completed; further CACHE optimization requires observed use. Portable candidate package (.899) is now the highest feasible remaining item in this ledger. Live matched-model evaluation retains maximal expected benefit (V=1.00) but remains execution-blocked; do not confuse ordering score with product value. No mandatory new helper, no production release.

Engineering method assessment: native connector discovery and verified readback used (MCP-Hub-style leverage); independent MCP-Hub skill execution not established in this round. Minimal changes to existing index and tests rather than a new certificate service (Ponytail-style design); no claim of invoking the independent plugin. Compared actual operation counts before/after (fast-anything-style measurement); no measured timing bottleneck or justification for native port. These describe applied principles, not plugin invocation receipts.
