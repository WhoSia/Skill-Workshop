# Workshop R&D decision ledger — 0.1.9

This ledger is a product-development record, not an additional mandatory runtime pipeline. Continue by selecting a consequential feasible candidate, implementing or investigating it, observing the result, updating affected axes, then selecting again. No numbered cycles, no weighted aggregate, no release just to show progress. Scores are scoped engineering judgments (0, .25, .50, .75, 1 anchors: absent/weak/partial/strong/satisfied); unknown actual incremental model quality stays unknown. Separate feasibility and hard gates from preference.

## Selected candidate and observed result

Prior audit found redundant fixed-subset enumeration inside an adaptive-only caller and string serialization in memo keys. Preserve public solveInquiry return fields and verifyInquiry contract; add solveAdaptiveInquiry backed by the same internal solver, use compact numeric state keys, and take a zero-cost shortcut when all initial fibers are resolved. This is a product change, not the earlier incompatible experimental patch.

- Native Node v22.16.0, local container, exact 0.1.8 archive SHA-256 2a7cbf8c210e7cbc51ca7832cefedb8332b8f2576b74f3a26938c57f10589a93.
- Eighty seeded finite models, 1,402 rows, 68 possible and 12 impossible: complete old/new solveInquiry objects equal; adaptive-only output equals old result without fixed; verifier results equal and pass for all 68 possible cases.
- Six CLI input models, seven interleaved subprocess repetitions per arm, startup/JSON included; full CLI output identical for each model. Timings are scoped to this local sample, not host latency.
- Nine admitted channels and already-resolved initial observation: old UNSUPPORTED; new POLICY_FOUND cost 0. This bypasses search limits only when no search is needed.
- The key mask * 2^n + bits represents a unique compatible subset in a fixed binary universe. No semantic loss from the representation change in the declared model. No claim about real-world measurement or unknown model quality.

| Case | Old median ms | New median ms | Additional observation cost |
| --- | ---: | ---: | ---: |
| selector4 | 49.606385 | 43.489914 | 4 |
| parity8 | 109.644277 | 60.173716 | 8 |
| threshold8 | 99.064738 | 60.828283 | 8 |
| AND8 | 67.734239 | 43.572828 | 8 |
| known branch | 34.268767 | 32.737340 | 3 |
| constant | 33.474702 | 31.073134 | 0 |

The larger parity/threshold/AND improvements justify this optional-compute change; small startup-dominated differences are not persuasive. No new native implementation. Default entry 225 words unchanged. Judgment now explicitly prefers separate axes and hard gates; the weighted calculator remains available only for a deliberately scalar preference problem.

## Candidate reassessment — no total

| Candidate | Expected utility | Quality preservation | Resource efficiency | Feasibility | Evidence | Decision |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Compatible adaptive optimization (before) | .90 | .60 | .85 | .90 | .75 | investigate first |
| Compatible adaptive optimization (after) | .90 | .90 | .90 | .95 | .90 | ship |
| Already-resolved shortcut | .75 | .90 | .85 | .95 | .75 | ship with optimization |
| Default nonaggregated judgment | .90 | .75 | .80 | .95 | .50 | ship as instruction change; behavioral benefit unknown |
| Further unconditional compression | .40 | unknown | .65 | .95 | .25 | park; quality unresolved |
| New executable method composition | .90 | unknown | .65 | .75 | .50 | investigate; reuse existing algorithms only if useful |
| Actual independent matched-model quality comparison | .95 | unknown | .50 | .25 | .00 | blocked by absent execution surface |
| Concrete discovery/structure applications with real artifacts | .95 | unknown | .75 | .85 | .25 | next feasible product work |
| Bound fixed-mode computation for large inputs | .75 | unknown | .80 | .80 | .50 | examine real workload limits; do not silently sacrifice exactness |

Evidence for optimized behavior is bounded to the tested finite model and the key invariant. Quality preservation refers to the existing algorithm/API for that row, not overall LLM output. The judgment instruction preserves the optional scalar API but its behavioral effect is unmeasured. Do not compare these scope-specific quality axes as universal performance.

## Release and next choice

Source snapshot ea4fe92c70c5f7965d77d03c702bc02231b102cf. Public ZIP SHA-256 8270732acf0f9d68078c12a9f6d6b5106cea3cf082b3e5eac44c51e37fc22970, 38,685 bytes, 15 members; repeated byte-identical repack from verified 0.1.8 archive and exact changed Git blobs (not a fresh checkout or invocation of repository builder). Private account updated in place to 0.1.9, USER/PRIVATE, 16 files, both manifest versions correct, five changed/entry source reads equal pinned Git source. No change to official 2.4.4 or Research OS contracts; no Actions. Direct host Node CLI and independent model quality remain unverified.

Next selected work: concrete application of Discovery/Structure to an actual research or development bottleneck, with a reusable method/working artifact rather than another abstract evaluation framework. Keep independent model comparison on hold until the required surface exists. Reassess after the actual result; do not assume the next version is necessary. 
