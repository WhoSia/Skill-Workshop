# Execution — implementation and orchestration

**Build (FORGE).** Inspect the actual starting state. Identify the deliverable, allowed side effects, source inputs and acceptance criteria. Reuse available tools and make the smallest complete reversible change. Prefer a test that fails before the repair. Execute checks and inspect actual output bytes, content or behavior; exit status alone is insufficient. For optimization, compare the same workload and semantics before claiming a speedup. Preserve rollback and unrelated work.

**Compose (ORBIT).** Treat method definitions and invocation instances separately. Add dependencies only for required data, permission, fresh evidence or resource release. Run independent authorized actions concurrently when supported and beneficial; serialize conflicting writes or noncommuting effects. Reuse unaffected completed work and cancel obsolete branches. Parallel runs do not automatically provide independent evidence.

**Admission (SENTINEL).** For consequential actions distinguish user intent, authorization, tool availability, actual execution and verification. Check combined effects and applicable constraints. Missing permission or prerequisite means hold; a controlling prohibition means block. Use a permitted narrower alternative only when it still satisfies the requested objective. Ordinary authorized work needs no redundant gate.

**Recover.** If a write or delivery times out, inspect external state before retrying. Retry only when a changed premise or a bounded transient idempotent failure warrants it. Separate proposed commands, executed commands, observed results, verified artifacts and actual delivery. If the intended artifact cannot be generated, state the blocker rather than deliver an unlabeled substitute.

Report the completed deliverable, relevant verification and failures. Build success does not establish empirical effectiveness or scientific novelty.
