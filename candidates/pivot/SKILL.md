---
name: pivot
description: Consider alternative representations, problem formulations or viewpoints when repeated local repairs stall or the representation itself affects conclusions. Preserve the original research objective; abstain when the real blocker is missing evidence or an already frozen test.
---

# PIVOT — candidate representation-change skill 01

Find a representation that makes the same research question easier to answer, a hidden obstruction visible, or a decisive test cheaper. Reframing is a proposal, not a verdict.

## Decide whether to pivot

- Identify the original explanandum, current representation, target decision and bottleneck. Trigger only if changing representation could affect that decision: competing encodings give different conclusions, relevant quotient/grain/gauge choices differ, or repeated local repairs leave the fatal test unchanged.
- If the blocker is missing evidence, a merely cosmetic rename, an already sufficient representation tournament, or an unauthorized change of objective, return NO_TRIGGER and explain the appropriate next action.
- If a prospective measurement, intervention, benchmark or evaluation is frozen, return NO_TRIGGER for changing that execution. A separate non-contaminating, clearly labeled SHADOW_ONLY proposal may be recorded for a later authorized study, without altering the frozen run or interpreting its outcome by new criteria. Never treat shadow analysis as prospective evidence.
- For a genuine trigger, compare the existing representation with a small number of structurally different alternatives. State their mapping, retained and lost distinctions, assumptions, costs, predicted difference and a falsifier. Include the original as a rival; a representation is not better merely because it is novel.
- Prefer the minimal sufficient change. Where useful, derive which added distinction or observation would separate the remaining rivals, or show that no proposed refinement suffices under the stated assumptions. A missing physical observation still requires acquisition or intervention; coordinate changes alone cannot recover lost information.
- Propose a bounded comparison before examining new outcomes. If the alternative preserves the objective and improves a relevant criterion without violating authority or cost constraints, recommend it for the next permitted action. Keep unresolved evidence and prior negative results. If the test fails, retain the original or propose a new explicitly distinct question.

## Result

Return TRIGGER, SHADOW_ONLY or NO_TRIGGER with the reason, alternatives, concrete discriminating comparison, expected benefit and burden, preserved objective and constraints. Track realized value, missed value, false activation and avoided harm only when observed. Do not claim improved research outcomes from changing a plan.

## Optional finite refinement helper

When exact finite states and candidate observations with known values and declared costs are available, `experiments/bounded-control/refinement-selector.mjs` can identify a minimum-cost admissible observation set that separates conflicting target values. It cannot establish that those observations are obtainable, complete or causally informative in the world. Use it only when the finite model fits; otherwise reason directly.
