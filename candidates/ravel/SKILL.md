---
name: ravel
description: Adapt research decisions when a consequential uncertainty, competing explanation, failed test, blocking condition, or resource trade-off changes the next action. Use for research progression, method selection, branch repair and stopping decisions; prefer direct reasoning for routine tasks.
---

# RAVEL — candidate research-control skill

Experimental candidate 01. This is a standalone instruction prototype, not a released replacement for Skill-Workshop 2.4.4.

## Objective

Advance the researcher's question with the smallest useful admissible action. Preserve the original objective, frozen evaluation rules and outstanding evidence limits. A good result can be a discovery, a decisive negative result, a better explanation, or a justified change of direction.

## Select the next action

1. Identify the live uncertainty and the decision it affects. Reuse current, applicable evidence and established decisions; reopen only a material conflict, changed dependency or stronger test.
2. Compare a direct native answer or continuation against a small number of relevant alternatives. Select a method only when it attacks a concrete assumption, unlocks a necessary prerequisite, contributes complementary information, or reduces cost without losing the intended result.
3. For a consequential decision, test the strongest relevant rival or counterexample before committing. If a critique changes nothing, omit it from further active work unless it remains a required obligation. Do not simulate reviewers or add ceremonial stages.
4. Choose the minimum sufficient admissible sequence. Follow only prerequisites relevant to the objective, but preserve alternative ways of satisfying them. Never skip a mandatory gate, broaden permission, or change the objective to save effort. Use actual available tools when they are useful; do not infer tool execution from a skill name.
5. Execute the chosen action if authorized and feasible. Examine the actual result, not merely whether a tool returned success. Update the next action when an observation, failure, or changed source makes it necessary. Avoid identical retries without a changed premise.
6. Continue while expected decision value justifies cost. Repair, narrow, fork, stop, or hold when warranted; do not reinterpret a terminal failure by rewriting its frozen criteria. A new question or evaluation regime must be explicitly distinguished from the original.

Use lightweight exploration for tentative hypotheses and learning. For claim promotion, satisfy the applicable evidence and independent verification requirements; consult the claim adjudication capability (COURT where available) rather than inventing a verdict. Process success never increases scientific authority by itself. An unavailable required capability produces an explicit blocker, not a silent substitute.

## Compact result

For a consequential decision, communicate the objective, chosen action and reason, the material rival or observation that changed the plan (or none), actual execution status, unresolved obligations, authority limit, and next action. Add 0–1 decision estimates only when useful, with their meaning and uncertainty; they are not measured probabilities. Routine work does not require a separate receipt or a fixed number of methods.

Do not store private reasoning transcripts. Do not claim execution, tool access, compatibility, or research improvement without evidence.

## Optional deterministic helper

Where a compatible trusted execution environment exposes a finite monotone obligation planner, use it for positive-cost prerequisite selection, not for open-ended scientific judgment. In this repository the experimental implementation is `experiments/bounded-control/obligation-planner.mjs`. A standalone host need not expose this file: use native reasoning within available permissions and disclose any material unresolved obligation. The helper's declared-contract result is not a scientific certificate.
