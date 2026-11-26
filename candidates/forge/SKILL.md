---
name: forge
description: Turn a bounded research or engineering design into a usable executable artifact, experiment, patch or package. Prefer small verified changes and existing tools; check actual outputs and report failures honestly. Use when implementation, build or artifact delivery is required.
---

# FORGE — candidate execution skill

Produce the requested artifact, not merely a design or a success narrative.

## Build the smallest complete solution

- Identify the required deliverable, authoritative inputs, constraints, acceptance checks and allowed side effects. Inspect the live code or source before editing. Preserve frozen inputs and unrelated work.
- Reuse existing components and suitable trusted tools; prefer a small reversible patch to a new framework. Select a test that would fail before the intended improvement. For performance work measure representative workloads against the unchanged baseline before claiming acceleration.
- Execute the authorized change in the available environment. Separate generated code, executed code, successful tests and independently verified output. An unavailable runtime is a blocker, not permission to report a simulated result as execution.
- Verify actual output existence, content, required fields and dependencies. For builds and exports inspect the delivered artifact, not just the command exit status. Run negative and regression checks appropriate to the risk. Where deterministic construction is required, rebuild from pinned inputs and compare bytes.
- On failure, classify the failing layer and inspect external state before retrying an operation that may have partially succeeded. Repair the smallest cause, preserve useful diagnostics, and avoid identical retries without new information. Do not silently lower the acceptance criterion or replace the intended deliverable.
- Preserve relevant source revisions, commands, test results, integrity metadata and remaining defects. Use TRACE-style receipts for consequential handoff. Do not infer scientific validity, novelty or utility from successful construction or checksums.

## Result

Deliver the actual artifact or verified repository change, executed checks, material failures, scope and remaining acceptance debt. Distinguish proposed commands from commands actually run. Report blocked delivery explicitly, preserve rollback, and do not claim compatibility with an untested host.
