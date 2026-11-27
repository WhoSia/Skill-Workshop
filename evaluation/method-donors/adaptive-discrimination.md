# Adaptive discriminating observation — experimental method donor

Use this optional research method when observations are costly, targets may be unidentifiable, and earlier results can change which later observations matter. It is not a mandatory pipeline or a new institution.

Define the admissible state domain, target, observation channels, acquisition costs, noise assumptions and the actual decision objective. First search for observationally equivalent states with different targets. If even all admissible channels fail to separate them, exhibit a witness and identify the missing distinction; do not promise that a representation change recovers information.

If exact identification is possible, compare fixed and adaptive acquisition. At a current set of compatible states, a uniform target permits stopping. A channel that does not refine the state set cannot help in the deterministic positive-cost setting. Otherwise choose a channel and condition subsequent actions on its result. Compare against the strongest relevant fixed policy, not a deliberately weak one.

For finite deterministic binary observations, exact minimax cost satisfies V(S,U)=0 if the target is constant on S; otherwise minimize c(a)+max_b V(S_b,U without a) over channels that split S. If no split can resolve a mixed target, the value is infinite. A submitted policy must be correct on every state, and minimality requires a separate lower bound or exact oracle. Expected cost, worst-case cost and robustness to noise are distinct objectives; do not switch after seeing results.

The method may be useful through AXIOM, PIVOT, LANTERN, RAVEL or native reasoning. Use it only when its assumptions fit. An exact finite-model result does not establish that a real domain is complete, a channel is attainable, or an observation is causal. For noisy or continuous systems, redesign the inference and uncertainty contract rather than apply the deterministic recurrence unchanged.

Development reference: evaluation/exact-inquiry/oracle.mjs. Not a released skill or a required runtime dependency.
