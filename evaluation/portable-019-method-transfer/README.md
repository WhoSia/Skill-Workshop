# Method transfer — isolate the failure, then improve the decision

Baseline: released 0.1.9, source ea4fe92c70c5f7965d77d03c702bc02231b102cf, public ZIP SHA-256 8270732acf0f9d68078c12a9f6d6b5106cea3cf082b3e5eac44c51e37fc22970. No new account release.

## Transferable method

Source: Zeller & Hildebrandt, Simplifying and Isolating Failure-Inducing Input, IEEE TSE 28(2), 2002, DOI 10.1109/32.988498 (abstract and author's publication page consulted, not full paper). Adapt the failure-preserving reduction idea: define a precise failure predicate, remove chunks of input components, retain only reductions that reproduce it, then check each single deletion. A 1-minimal case is local to the declared deletion operations, not a globally smallest input or proof of a unique root cause. Distinguish invalid inputs and unresolved executions from reproduction. Never minimize away the original evidence; keep the baseline and replay it after repair.

Here Structure supplies the invariant, Discovery supplies the reduction method, Representation supplies the full-observation signature, and Execution evaluates the actual program. This is a useful cross-method composition, not a mandatory workflow.

## Actual application

A supported exact binary search can prove nonidentifiability, but the adaptive adapter reports UNSUPPORTED for some nonbinary or above-limit inputs even when two enumerated states have identical initial and all admitted additional observations and differing targets. This is a diagnostic coverage gap, not an incorrect mathematical verdict. The fixed result remains available but no plan within budget is not equivalent to impossibility.

Native Node 22.16.0 extracted from verified 0.1.9 archive. Reduction predicate: original adaptive status UNSUPPORTED AND an independently checked full-signature target conflict. Initial synthetic case 64 rows, 5 channels; 25 baseline executions in the reduction and single-deletion checks; 1-minimal 4 rows, 1 channel, with observed values 0,0,1,2 and targets 0,1,0,1. The two rows with value 0 have different targets. Any single row or channel deletion loses the predicate (may still be impossible, but baseline can then diagnose it). No need for a categorical optimizer to provide this witness.

Candidate: only after an unsupported adaptive outcome and absent fixed plan, group rows by JSON-encoded tuple of initial observation and every admitted channel value; return a witnessed impossibility on conflict. Linear number of row/channel visits, storage proportional to distinct signatures, string size matters. Otherwise preserve UNSUPPORTED. No change to fixed-only execution, exact binary optimization, budget, or admitted-channel selection. Full-signature conflict proves impossibility for deterministic observations on the supplied domain; it cannot establish completeness of that domain or any real-world causal claim.

Eight synthetic application models: old/new audit and fixed refinement identical on all eight. Three unsupported cases with actual conflicts now return valid witnesses (original multivalued, minimized, nine-channel limit). Five other outcomes exactly preserved, including unsupported but feasible and unsupported with no plan at budget zero. Five alternating subprocess repetitions per arm/case, startup and JSON included; median ms old/new: original 32.27/33.64, minimized 30.11/29.10, nine-channel 28.91/33.13, ordinary binary 30.93/30.49, fixed-only 31.58/34.05. Small noisy samples do not establish latency equivalence or speedup. Fallback allocates additional signatures for some unsupported inputs, so large-input memory cost remains open.

## Nonaggregated candidate decisions

Axes are prospective engineering judgments, not measured probabilities. Quality is scoped to preservation of existing behavior, not LLM quality; ? means unknown. No total.

| Candidate | Utility | Quality preservation | Efficiency | Feasibility | Evidence | Decision |
|---|---:|---:|---:|---:|---:|---|
| Full-signature diagnosis before experiment | .85 | .65 | .80 | .95 | .25 | implement trial |
| Conditional witness fallback after experiment | .90 | .90 | .75 | .95 | .75 | retain candidate |
| Always scan all inputs | .75 | .90 | .55 | .95 | .50 | defer; unnecessary work |
| General categorical adaptive optimizer | .85 | ? | ? | .55 | .25 | investigate if demand exists |
| Reusable failure-preserving reduction method | .90 | .85 | .75 | .95 | .75 | retain method |
| Further entry compression | .40 | ? | .65 | .95 | .25 | park |

Next: assess general applicability of failure-preserving reduction to non-observation tasks (e.g. a reproducible software regression or failed data pipeline); compare method benefit with ordinary direct diagnosis, then decide whether to integrate it as an optional reference. The trial is not independent model efficacy. Retain 0.1.9; candidate is not yet a deployed change. Direct ChatGPT host CLI, independent matched model quality, larger workload costs, and full legacy compatibility remain unverified. No GitHub Actions, no official 2.4.4 change.
