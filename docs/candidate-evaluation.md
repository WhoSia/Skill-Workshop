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
