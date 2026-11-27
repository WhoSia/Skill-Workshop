# Portable 0.1.8 audit — frozen product, no release promotion

Scope: audit the current development plugin and compare concrete product alternatives. No v0.1.9, no change to deployed code, no weighted aggregate ranking. Pinned implementation c43b8083d7961842596699c6b6cd82975bf57562; public archive SHA-256 2a7cbf8c210e7cbc51ca7832cefedb8332b8f2576b74f3a26938c57f10589a93. Account 0.1.8 current; all 14 skill/reference/script files independently read back and match pinned Git source. Actual current skill entry and Judgment reference loaded. Read the deployed fiber and refinement functions through the skill source reader, then evaluated their pure functions in V8 after removing export declarations. The illustrative two-state release/readback model returned the ambiguity witness and cost-1 readback selection; this demonstrates accessible source and pure-function execution, not direct Node CLI execution in the ChatGPT host or independent model efficacy.

## Context costs and compression

| Version | Entry words | Reference words | Total Markdown words | Script bytes | ZIP bytes |
|---|---:|---:|---:|---:|---:|
| 0.1.0 | 297 | 1096 | 1393 | 0 | 12485 |
| 0.1.4 | 379 | 2066 | 2445 | 0 | 21009 |
| 0.1.5 | 225 | 2066 | 2291 | 0 | 19898 |
| 0.1.8 | 225 | 2352 | 2577 | 14547 | 37881 |

Direct archive byte checks: all eight references identical in 0.1.4→0.1.5; current entry retains all 21 named routes. Current entry plus one relevant reference ranges from 391 (Discovery) to 656 (Judgment) words. This is static word count, not model tokens or host startup time. Multiple loaded references can erase savings. The compact entry retains goal, frozen criteria, selective routing, authorization, stopping, disclosure and evidence constraints, but reduced explanations may change routing accuracy. Independent behavioral comparison remains unavailable; do not infer semantic or task-quality equivalence from file equality.

## Actual observation CLI experiments

Native Node 22.16.0, Python 3.13.5, local x86-64 container. Extracted 0.1.6 and 0.1.8 ZIPs. Ten synthetic deterministic models. Fixed output exactly equal old/new in all ten. Replayed every returned adaptive policy on all supplied rows, checked leaf target, no repeated channel, admission and worst path cost; verified full-admitted-observation obstruction witness. Five interleaved subprocess runs per mode per model; startup and JSON included, noisy small samples.

| Model | Fixed cost | Adaptive cost/status | Fixed ms median | Adaptive ms median |
|---|---:|---|---:|---:|
| selector4, 64 states | 10 | 4 | 35.01 | 44.53 |
| parity8, 256 states | 8 | 8 | 37.79 | 103.06 |
| known branch, 8 states | 6 | 3 | 28.14 | 30.62 |
| tight switch, 8 states | no plan at budget 4 | 4 | 30.38 | 30.53 |
| hidden target, 8 states | no plan | impossible witness | 30.92 | 30.16 |
| parity4 budget 2 | no plan | over budget, cost 4 | 29.32 | 35.04 |
| constant | 0 | 0 | 31.25 | 30.97 |
| nonbinary target | 2 | unsupported | 29.00 | 28.99 |
| resolved nine-channel model | 0 | unsupported | 32.41 | 32.95 |
| nonbinary channel | 2 | unsupported | 29.04 | 30.14 |

Observations: optional adaptive has concrete acquisition-cost benefit in selector/known-branch/tight-budget examples, no benefit in parity; narrower input domain. The resolved-nine case is a documented limit but unnecessarily reports unsupported even though fixed mode establishes zero additional cost; consider early resolved shortcut. Fixed search still has unbounded input rows; no hard wall-clock guard on the CLI. Not a claim about real experiment acquisition costs.

## Non-deployed optimization experiment

The adapter calls solveInquiry per unresolved fiber but consumes only adaptive output, while the oracle also enumerates fixed subsets. Existing memo keys serialize all state IDs. Compared original, remove redundant fixed enumeration, and additionally replace the memo key by mask * 2^n + observed bit pattern. Within one fixed binary-state universe, a given mask and observed bits uniquely determine the compatible subset; bits are zero outside the mask. Separate per-call memo, n<=12; integer key fits exactly. No change to search objective or tie ordering. The experimental patch is explicitly not safe to apply to canonical oracle directly: removing the fixed field would break solveInquiry's existing contract and verifyInquiry. A production candidate must preserve default output/verification or expose a separate adaptive-only path.

Actual extracted-CLI output equal for all three variants on 18 models, 1296 enumerated rows: selector4, parity8, known branch, constant8, threshold8, AND8 and 12 seeded random Boolean tables (seed 20261127, 2–6 variables). Seven interleaved subprocess runs per arm, rotated arm order. Median ms:

| Model | Current | Remove fixed | Remove fixed + compact key |
|---|---:|---:|---:|
| selector4 | 45.81 | 46.41 | 43.79 |
| parity8 | 108.14 | 106.63 | 60.57 |
| known branch | 31.61 | 30.87 | 30.73 |
| constant8 | 37.15 | 32.87 | 34.20 |
| threshold8 | 95.14 | 91.01 | 57.34 |
| AND8 | 65.76 | 43.73 | 44.62 |

Compact-key candidate reduces median 43.99% parity8, 39.74% threshold8, 32.14% AND8, 4.42% selector4. Removing fixed alone was marginal in parity/threshold and beneficial in AND; no uniform dominance across all measured runs. Small startup-dominated differences not persuasive. Exact output equality is scoped to CLI and supplied models; no oracle API equivalence. No native port justified. Candidate remains an experimental patch; no deployment.

## Decision audit without aggregate

The 0.1.8 calculator's illustrative prior result reproduced exactly (regret .2385 selective, .34 compact, .3925 full). But weighted-sum ranking can miss a feasible nondominated candidate: quality/speed A=(1,0), B=(0,1), C=(.45,.45). For every normalized two-axis weight, max(A,B)>=.5>C=.45. Actual calculator reports C as minimax-regret leader across the three profiles {quality-only, equal, speed-only}; no nominal winner C. With independent minima .4 on both axes, only C is feasible. Preserve the helper as an optional scalar decision model, not the Workshop's overall evaluation rule. Use hard constraints, separate axes, Pareto relations and explicit tradeoff decisions. Do not invent missing quality scores.

Non-aggregated engineering ratings use 0=no evidence/no demonstrated realization, .25=limited design or indirect evidence, .50=partial bounded implementation, .75=meaningful bounded demonstration, 1=criterion satisfied within the declared scope. Expected usefulness is explicitly a design judgment; actual incremental model efficacy remains unknown. Distinct axes: implementation maturity M, prospective utility U, evidence strength E for the bounded function, host accessibility H. No summed score or ranking.

| Block | M | U | E | H |
|---|---:|---:|---:|---:|
| Structure | .50 | .75 | .25 | .75 |
| Representation | .75 | .75 | .75 | .75 |
| Discovery | .50 | .75 | .25 | .75 |
| Execution | .75 | .75 | .50 | .75 |
| Continuity | .50 | .75 | .50 | .75 |
| Transition | .50 | .75 | .50 | .75 |
| Authoring | .50 | .75 | .25 | .75 |
| Judgment | .75 | .75 | .50 | .75 |

Host accessibility refers to deployed/accessible source and reference routes, not automatic invocation or CLI execution. E for Representation comes from exact finite computations, E for Execution/Continuity/Transition from actual plugin development and version-state observations, E for Judgment from actual scalar calculator execution (not independent decision quality). For other blocks, static guidance alone supports limited E. Native comparison and exact legacy baseline absent for all blocks. Treat those as unknown quality, not a score of zero for quality.

Decisions: retain 0.1.8 frozen; prioritize compact-key optional optimization only after preserving canonical API; retain fixed default and opt-in adaptive; investigate resolved shortcut/resource bounds; no further unconditional entry compression absent behavioral evidence; do not force weighted decision calculator for general evaluation. Highest unresolved product question remains incremental task quality vs a matched native model, with genuinely independent arms and same model/effort/access; no such inference execution surface found. Do not substitute same-assistant simulated judgments. Next useful work should include real task use and targeted capability improvements, not larger test counts. No official release/Research OS changes, no GitHub Actions, no new account plugin release.
