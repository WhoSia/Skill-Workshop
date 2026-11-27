# Candidate skill acceptance — matched-task evaluation

Status: prospective evaluation protocol, not a completed model experiment. The candidate skills and their helper tests are development artifacts. No final release identifier is assigned.

## Product objective

A candidate must earn its instruction overhead through better task completion, decision quality or verified resource efficiency than native reasoning and, when the exact original is available, the corresponding legacy skill. The goal is not a higher count of invoked skills, longer reports, or more passing synthetic fixtures.

## Arms and isolation

Compare native model without Workshop instructions, the exact 2.4.4 baseline, candidate skills individually, and adaptive composition where the task warrants it. Keep model revision, effort, accessible tools, input evidence and maximum resource budget matched. Use fresh isolated sessions, randomize arm order and blind the evaluator to arm identity when feasible. Do not expose the expected answer or other arms' outputs to the executing model. Record actual invocation and tools, not just installation. If an arm cannot be run, retain an explicit missing arm rather than substitute a reconstructed legacy prompt. Do not send private Lab data to an unapproved service.

## Tasks

Development cases already used to design the candidates are not held-out evidence. Freeze new task instances and their independent expected checks before collecting outputs. Include both routine tasks where direct reasoning should suffice and substantial cases where specialized methods may improve an action. Cover:

- formal structure and counterexamples, including a true proposition and an out-of-domain attack;
- evidence discovery with duplicate editions, unavailable originals and a competing explanation;
- research planning with relevant and irrelevant prerequisites, blocked required evidence and failure recovery;
- representation change that genuinely improves a discriminating test, and a missing-evidence case where reframing is inappropriate;
- synthesis with shared provenance, contradictory verdicts and unresolved obligations;
- claim adjudication with engineering success but no empirical efficacy, and an eligible prior result with stale dependencies;
- a completed task where an additional method should be omitted.

Use genuinely new source artifacts or generated instances with independent checks. The examples above are strata, not held-out answers. A prospective trial must seal task identity, arm instructions, budgets, evaluator rubric and analysis before collecting results.

## Outcome and release decisions

Measure actual task completion and objective correctness first. Record correctness, scope fidelity, useful decision changes, appropriate abstention, material omissions, unsupported claims, unnecessary method calls, time, token use if available, tools, and human review burden separately. Report missing instrumentation rather than estimate it as observed. Where scoring needs judgment, use a predeclared rubric, retain evidence for each score, and distinguish subjective ratings from observed outcomes.

Fatal failures: unauthorized side effects, fabricated execution or sources, material goal substitution, frozen-criterion alteration, invalid claim promotion. No efficiency score cancels these. Compare paired tasks, show per-task differences and failure strata, and avoid generalization from a small convenience cohort. An improvement in a deterministic helper does not establish model-level performance.

Promotion requires a material measured gain without unacceptable loss on required contracts, with rollback and unchanged existing consumers until their compatibility is actually tested. If direct reasoning ties or beats a candidate at lower cost, prefer direct reasoning for that task class. Stop or redesign a candidate that merely adds process. Retain negative results.

## Current execution limits

A connector discovery attempt found no independent model inference surface in the current session. Exact 2.4.4 archive bytes remain unavailable for comparison. The native/candidate/legacy arms have not been executed here; the protocol does not claim they have. The synthetic component composition test is a separate engineering check.

## Compact RAVEL and decision-probe experiment — 2026-11-27

The existing RAVEL candidate remains unchanged. A competing instruction prototype at `evaluation/variants/ravel-compact/SKILL.md` reduces trimmed whitespace-delimited words from 551 to 278 (49.55%) and characters from 3,993 to 1,943 (51.34%). These are actual text measurements, not token, latency or quality measurements. The compact variant deliberately preserves the objective, frozen criteria, native-first alternative, reuse, mandatory prerequisites, actual execution, failure handling, stopping and scoped authority. It uses less explicit wording about complementary methods and detailed receipts; it also removes the repository-specific optional helper locator. Those changes are possible losses to test, not established equivalence. No production substitution.

`evaluation/ravel-probe/tasks.json` provides 12 synthetic decision probes with five numeric outcomes. The separately stored answer key and exact scorer evaluate action, status and required numerical values; reasons are preserved for human inspection, not automatically certified. A first-option bias in the initial task draft was corrected before any model evaluation. At the pinned revision the correct action positions are distributed 3/4/4/1 across the four possible positions (one task has four actions). Always choosing the first action gives 3/12 correct; always choosing the first status gives 4/12; choosing both first with no numbers passes 0/12. These are deliberately weak position controls, not native model performance.

The exact scoring implementation passed 41 checks in V8 including key/task consistency, missing/duplicate/unknown outputs, numeric type and tolerance handling, order invariance and isolated action/status/value mutations. The task key was authored by the same assistant, so these are developmental conformance probes, not an independent held-out benchmark. The options are semantically leading and likely to create a ceiling effect. A complete correct answer can still contain poor reasoning; reason presence is not reason validity. The suite must not be used as sole product acceptance evidence.

Frozen development snapshot: 13802938dde2efe326348c58dc08bf819fb4071f. Compare the native, existing candidate and compact arms on exactly the same task input, never supply the key or other outputs to executing sessions, and record actual model revision, effort, tool access, cost and observations. Exact 2.4.4 is an additional arm only when available. Open-ended tasks requiring substantive derivation, experiment design or repair are a higher-value follow-on; use independent scoring and new instances. No independent model inference surface was found in this session; no arm outcomes collected. The native Node CLI for the scorer was not executed here.

| Decision | R | V | E | F | B | Status |
|---|---:|---:|---:|---:|---:|---|
| Compact competing RAVEL prototype | 1.00 | .98 | .83 | .99 | .12 | implemented, not promoted |
| Executable developmental probe | .99 | .94 | .90 | .99 | .17 | implemented and checked |
| Open-ended research work samples | 1.00 | .99 | .88 | .96 | .24 | next feasible |
| Independent matched model comparison | 1.00 | 1.00 | .90 | .20 | .45 | execution surface unresolved |
| Replace original candidate now | .90 | .75 | .25 | .99 | .10 | hold; no measured efficacy |
| More unrelated infrastructure | .45 | .40 | .30 | .95 | .45 | defer |

Scores are subjective 0–1 design estimates, not measured effects. No GitHub Actions, consumer migration or official release. MCP-Hub relevance assessed by tool discovery, no independent invocation established; smallest-change design and text-size measurement applied, no performance claim or native port justified.

## Exact Inquiry — open-ended research work samples

Frozen development snapshot: 2bb21dcbad47caccb7f1ffc87661e0a0870884ee. Five finite binary observation problems, 96 supplied states, no answer choices. Each asks for a constructed adaptive policy and fixed measurement set with exact costs, or a concrete indistinguishable-state counterexample. The prompt explicitly specifies worst-case cost, the output certificate schema, and the finite domain. Task inputs and evaluator are separate; provide only tasks.json to executing arms. Same-assistant authored development set, not an independent held-out model benchmark. No model arm outputs.

| Case | Minimax adaptive cost | Minimum fixed cost |
|---|---:|---:|
| switch | 4 | 7 |
| selector4 | 4 | 10 |
| parity | 6 | 6 |
| alias | impossible | impossible |
| expensive-switch | 10 | 11 |

The finite minimax solver uses partition recursion and memoization. The fixed solver enumerates subsets. A separate certificate verifier walks every state along the submitted policy, checks branch coverage, repeated channels, target correctness and cost, and compares against the exact oracle. It accepts alternative optimal policies, not only a canonical tree. The verifier's optional oracle argument is trusted evaluator input, never a model answer field. Reasons and analytic lower-bound proofs require separate human assessment. The solver supports up to 12 binary channels and 4096 supplied states with positive bounded integer costs; worst-case exponential resource use remains. This is not a noisy, continuous or causal-inference solver.

577 checks in V8: 180 generated models, independent budget-feasibility search and pairwise fixed-sufficiency oracle; 102 impossible, 7 strict adaptive improvements among the generated models. A specific valid alternative policy for expensive-switch achieves uniform mean 6.5 but worst cost 11; the minimax optimum is 10 with mean 10 for the returned policy. The verifier rejects the alternative under the declared minimax objective, not because the policy is incorrect. No native Node CLI or model performance claim.

Extracted an optional method donor, `evaluation/method-donors/adaptive-discrimination.md`, for AXIOM/PIVOT/LANTERN/RAVEL/native reasoning. It distinguishes identifiability, adaptive policy, fixed baseline and cost objective. No mandatory call order or new institution. It is not added to the production candidate until a useful behavioral comparison supports that change.

Next: diversify to open-ended research tasks outside finite deterministic observation; test actual candidate method use against direct native reasoning. Avoid adding more solvers unless a genuine research method or practical bottleneck warrants them. Priority estimates (R,V,E,F,B): exact inquiry work sample (1,.99,.95,.98,.20) complete; optional method donor (.98,.97,.91,.98,.12) complete; independent model trial (1,1,.90,.20,.45) blocked; distinct empirical reasoning work sample (.99,.98,.89,.96,.20) next. MCP-Hub testing discovery returned internal failure; no separate skill execution claimed. No Rust port or speed claim.
