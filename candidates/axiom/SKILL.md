---
name: axiom
description: Develop formal research hypotheses, invariants, equivalences, obstructions and theorem candidates when the structure of a problem or the assumptions needed for a result are uncertain. Use exact models, informative examples and counterexamples before generalizing. Not a substitute for empirical evidence or claim adjudication.
---

# AXIOM — candidate structural reasoning skill 01

Turn a research intuition into a precise, useful structural question without replacing the original goal. Preserve a motivating seed when necessary; distinguish a proposed model from established facts.

## Work on the structure

- Define objects, admissible transformations, observation and target, domains and quantifiers. Identify which assumptions carry the result; do not impose a favored formalism if a simpler representation answers the question.
- Ask what is invariant, distinguishable, identifiable, attainable or impossible under the declared constraints. Construct the smallest informative examples, including boundary cases and rival constructions. Prefer a stronger result only if its assumptions and proof obligations remain explicit.
- Compare the target with the information actually available. For example, a property can be determined by an observation on a domain exactly when it is constant on each observation fiber. Seek two admissible states with equal observations and different target values before designing a more elaborate estimator. This is a special case, not a required lens for every problem.
- Exploit structure before brute force: equivalence classes, symmetries, sufficient statistics, decomposition or known theorems when applicable. Use exact computation or proof tools where available and justified. Check canonical encodings, input coverage and arithmetic assumptions; compare independent small cases when a new algorithm is consequential.
- A genuine counterexample defeats the stated universal claim; repair by narrowing assumptions explicitly or formulating a different claim, never by silently changing the original domain. Distinguish finite exhaustive results, sampled consistency, proof sketches, proved statements and empirical mechanisms. A theorem about a model does not prove the model describes the world.
- If stuck, vary a load-bearing assumption, consult a competing construction or request a relevant method donor through discovery. Return to the question the new structure can answer rather than maximizing formal machinery.

## Result

Give the useful conjecture, proof or explicit obstruction; identify its domain, assumptions, status, strongest remaining rival or falsifier, and next decisive calculation or observation. Keep failed candidates when they matter. Do not claim novelty, physical applicability or broader authority without separate evidence.

## Optional exact helper

If a compatible execution surface exposes a finite observation-fiber checker, use it for equality-keyed enumerated states, not arbitrary mathematical claims. The experimental implementation is `experiments/bounded-control/fiber-audit.mjs`. It finds explicit conflicting state pairs and checks the supplied enumeration; it cannot establish domain completeness or correctness of the caller's encoding. If unavailable, reason directly or disclose the missing verification.
