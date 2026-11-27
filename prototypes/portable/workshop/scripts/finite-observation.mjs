import { readFileSync } from "node:fs";
import { fiberAudit } from "./fiber-audit.mjs";
import { selectRefinement } from "./refinement-selector.mjs";

// Input is a declared finite model, not measured evidence.
const { rows, channels, budget } = JSON.parse(readFileSync(0, "utf8"));
const refinement = selectRefinement({ rows, channels, budget });
const audit = fiberAudit(rows.map(r => ({
  id: r.id, observation: r.observation, property: r.target
})));
console.log(JSON.stringify({ audit, refinement }, null, 2));
