import { readFileSync } from "node:fs";
import { fiberAudit } from "./fiber-audit.mjs";
import { selectRefinement } from "./refinement-selector.mjs";

// Input is a declared finite model, not measured evidence.
const { rows, channels, budget, adaptive = false } = JSON.parse(readFileSync(0, "utf8"));
if (typeof adaptive !== "boolean") throw Error("adaptive must be boolean");
const refinement = selectRefinement({ rows, channels, budget });
const audit = fiberAudit(rows.map(r => ({
  id: r.id, observation: r.observation, property: r.target
})));
const result = { audit, refinement };

if (adaptive) {
  const usable = channels.filter(c => c.admitted === true);
  const groups = new Map();
  for (const r of rows) {
    if (!groups.has(r.observation)) groups.set(r.observation, []);
    groups.get(r.observation).push(r);
  }
  // The original observation is free; each policy starts in its own fiber.
  // Keep this optional exact search bounded; ordinary fixed mode is unchanged.
  if (usable.length > 8 || rows.length > 512 ||
      usable.some(c => c.cost > Number.MAX_SAFE_INTEGER / (12 * 4096))) {
    result.adaptive = { status: "UNSUPPORTED", reason: "adaptive model exceeds bounded search limits" };
  } else {
    const { solveInquiry } = await import("./inquiry-oracle.mjs");
    const policies = [];
    let unsupported = false, obstruction = null;
    for (const [observation, group] of groups) {
      const targets = [...new Set(group.map(r => r.target))];
      if (targets.length === 1) {
        policies.push({ observation, cost: 0, tree: { target: targets[0] } });
        continue;
      }
      const levels = new Map(usable.map(c => [c.id, [...new Set(group.map(r => r.values[c.id]))]]));
      if (targets.length > 2 || [...levels.values()].some(v => v.length > 2)) {
        unsupported = true;
        continue;
      }
      const model = { channels: usable, states: group.map(r => ({
        id: r.id, target: targets.indexOf(r.target),
        observations: Object.fromEntries(usable.map(c => [c.id, levels.get(c.id).indexOf(r.values[c.id])]))
      })) };
      const solved = solveInquiry(model);
      if (solved.status === "impossible") {
        obstruction = { observation, states: solved.witness };
        break;
      }
      function decode(node) {
        if (Object.hasOwn(node, "target")) return { target: targets[node.target] };
        return { channel: node.channel, branches: Object.fromEntries(
          Object.entries(node.branches).map(([k, v]) => [levels.get(node.channel)[Number(k)], decode(v)])
        ) };
      }
      policies.push({ observation, cost: solved.adaptive.cost, tree: decode(solved.adaptive.tree) });
    }
    if (obstruction) result.adaptive = { status: "IMPOSSIBLE_ON_ENUMERATED_DOMAIN", witness: obstruction };
    else if (unsupported) result.adaptive = { status: "UNSUPPORTED", reason: "nonbinary fiber; fixed result still available" };
    else {
      const cost = Math.max(...policies.map(p => p.cost));
      result.adaptive = { status: cost <= budget ? "POLICY_FOUND" : "OVER_BUDGET",
        cost, policies, objective: "MINIMAX_ADDITIONAL_COST_CONDITIONAL_ON_INITIAL_OBSERVATION" };
    }
  }
}
console.log(JSON.stringify(result, null, 2));
