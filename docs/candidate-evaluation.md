# Candidate skill acceptance — matched-task evaluation

Status: prospective evaluation protocol, not a completed model experiment. The existing seven skill candidates and their helper tests are development artifacts. No final release identifier is assigned.

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
