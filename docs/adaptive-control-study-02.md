# Adaptive research control — design study 02
Date: 2026-11-27. Status: proposal; no runtime implementation, release or migration authorized here.

## Research question
When does choosing and revising a task-local research workflow yield more useful research per unit of total cost than a fixed pipeline or native model reasoning? Treat the design of research control as a resource-bounded metareasoning problem, not a requirement to invoke every available skill.

## Three competing architectures
A. Native model with concise current doctrine and tools. Lowest coordination overhead; may omit useful methods.
B. Fixed, compact stage templates with conditional gates. Stable and inexpensive for repeated tasks; may become brittle when an unexpected bottleneck appears.
C. Adaptive controller with bounded local workflow synthesis and repair. Can change the method, representation or next action; pays selection and state costs. Start with B plus a small repair mechanism; use C only when a measured failure of B warrants it. No dedicated planner model, universal graph compiler, or learned policy required for the first comparison.

## Two graphs, one evolving state
Distinguish the operational graph (prerequisites and executable actions) from the evidential graph (claim, root, scope and authority dependencies). Operational cycles across successive state revisions are permitted; circular justification within a claim is not. Use immutable revision IDs and typed ports. A change to an upstream interface invalidates only consumers of the changed port, not the entire project. Completed side effects are observed facts, not reversible simply because a plan node was invalidated.

Minimal state:
- original objective, authorized deliverable and budget
- current question, competing explanations, expected decision change
- evidence references with scope, root, revision and authority
- candidate operations, availability, conditional prerequisites and declared costs
- decision receipt and unresolved obligations

Propose operations using the model and relevant methods; filter legal actions before ranking; execute ready actions; classify outcome; repair the affected fragment or stop. A missing tool must yield an explicitly scoped fallback or a HOLD, never a fabricated success. Distinguish PROPOSAL, EXECUTED, VERIFIED and ADMITTED. Store concise decision summaries, not private deliberation.

## A bounded metareasoning counterexample
Illustrative decision-loss model, not performance measurements. Baseline work costs 1. An optional review costs 2 and eliminates a recoverable error that would otherwise cost 10. Error frequency p is known in this model. Routing costs 0.5 and initially reveals the need for review perfectly. No mandatory scientific or safety gate is subject to this optional review calculation.

Direct expected loss = 1 + 10p.
Fixed review = 3.
Adaptive routing = 1.5 + 2p.
The adaptive option strictly beats both only for 1/16 < p < 3/4. At p=0 it wastes routing work; at p=1 fixed review is cheaper. If sensitivity and specificity are both 0.9, and unnecessary reviews have the same cost as necessary ones, adaptive expected loss becomes 1.7 + 2.6p. It strictly beats both only for 7/74 < p < 1/2. These values were checked using exact rational arithmetic at six example frequencies; the premises are stipulated, not fitted.

General proposed rule: compare the expected improvement in a decision after an operation with its full incremental cost and opportunity cost. Evaluate uncertain estimates over ranges. Never let a cost score authorize a prohibited action or erase a mandatory obligation. Single-step estimates may miss complementary operations; use limited lookahead only when justified.

## Consumer compatibility witnesses — draft
The existing Research OS integrated runtime S0–S11, claim-scope product type, authority-edge registry, merge-recomposition compiler, RAVEL global runtime, and lab-local constraints are semantic predecessors, not a demand to preserve their physical module topology. These witnesses are proposed from inspected contracts, not executed compatibility tests.

| ID | Consumer contract | Input / event | Required outcome |
|---|---|---|---|
| C01 | Task binding | Time budget exhausted before deliverable complete | Yield with original objective and exact pending work; no silent downshift |
| C02 | Authority edge registry | Changed observable interface and resume request | Interface delta before equivalence, equivalence before continuation; reject missing prerequisite |
| C03 | Claim scope | Synthetic proxy or launch receipt offered as human or completion evidence | Reject cross-axis widening; explicit new evidence required |
| C04 | Root/freshness and projection set | Two current projections disagree and one is newer | Re-resolve authoritative roots; no timestamp-only winner; HOLD if unresolved |
| C05 | Merge/recomposition | Shared ancestor and unresolved claim across two branches | Deduplicate roots, preserve conflict and claim-level ceiling; no PASS union |
| C06 | RAVEL / origin | Two enabling stages without direct core progress | Return-to-origin review, not self-renewing continuation |
| C07 | Lab-local specification maturity | One successful snapshot | No automatic canonical promotion |
| C08 | Observer-first method | Instrument semantics changed when measured effect changes | Audit instrument before attributing failure to theory |
| C09 | Independent branches | Same evidence root, different reviewer personas | Do not count as independent replication |
| C10 | Local editing audit | High recommendation score, unsupported factual claim | Keep preference score separate from evidence/claim admission |

Retain historical names as versioned aliases to semantic contracts. For each live consumer record exact revision, binding status, port, mandatory predicates, replacement and counterexample. An alias with no tested behavioral contract is unresolved. Do not modify Research OS until actual consumer tests pass; keep 2.4.4 available for rollback. A design document is not migration evidence.

## Falsification experiment
Compare direct reasoning, fixed template, and bounded repair on paired held-out task families with equal tool access and resource ceilings. Freeze objective and success criteria before execution; reserve final holdouts. Record task correctness, meaningful next-action changes, unsupported claims, resource use, recovery, and researcher effort separately. For each failure, distinguish method selection, execution, measurement, and authority. Reject C if it cannot earn its overhead under meaningful comparisons. Treat optional LIRA/JEV scores as judgments, not calibrated probabilities or proof.

## Reading
Russell & Wefald (1991), Principles of Metareasoning, https://doi.org/10.1016/0004-3702(91)90015-C — abstract/introduction inspected from held copy.
Lieder & Griffiths (2020; held 2019 accepted manuscript), Resource-rational analysis, https://doi.org/10.1017/S0140525X1900061X — abstract/introduction inspected.
Horvitz (1988), Reasoning Under Varying and Uncertain Resource Constraints, https://erichorvitz.com/ai88.htm — bibliographic and abstract contact.
FlowBench, https://aclanthology.org/2024.findings-emnlp.638/; AgentBoard, https://arxiv.org/abs/2401.13178; AdaPlanBench, https://arxiv.org/abs/2606.05622 — benchmark candidates, not yet independently reproduced.
