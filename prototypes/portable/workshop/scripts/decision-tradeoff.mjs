import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

// Scores are caller-declared independent intervals, not measured probabilities.
export function decideTradeoff({ criteria, profiles, candidates }) {
  const str = v => typeof v === "string" && v.length > 0;
  const unit = v => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1;
  const unique = xs => new Set(xs).size === xs.length;
  const fail = () => { throw Error("invalid decision model"); };
  if (!Array.isArray(criteria) || !criteria.length || criteria.length > 20 ||
      !criteria.every(str) || !unique(criteria) ||
      !Array.isArray(profiles) || !profiles.length || profiles.length > 32 ||
      !Array.isArray(candidates) || !candidates.length || candidates.length > 50) fail();
  if (profiles.some(p => !p || !str(p.id) || !p.weights ||
      criteria.some(k => !Object.hasOwn(p.weights,k) || !unit(p.weights[k])) ||
      Math.abs(criteria.reduce((s,k) => s+p.weights[k],0)-1)>1e-9) ||
      !unique(profiles.map(p=>p.id))) fail();
  if (candidates.some(c => !c || !str(c.id) || !["eligible","hold","blocked"].includes(c.gate) ||
      (c.gate==="eligible" && (!c.scores || criteria.some(k => {
        const v=Object.hasOwn(c.scores,k)?c.scores[k]:null;
        return !Array.isArray(v) || v.length!==2 || !v.every(unit) || v[0]>v[1];
      })))) || !unique(candidates.map(c=>c.id))) fail();
  const eligible=candidates.filter(c=>c.gate==="eligible");
  const excluded=candidates.filter(c=>c.gate!=="eligible").map(c=>({id:c.id,gate:c.gate}));
  const eps=1e-12;
  if (!eligible.length) return {status:"HOLD",excluded,authority:"DECLARED_DECISION_MODEL_ONLY"};
  const summaries=profiles.map(p=>{
    const intervals=eligible.map(c=>{
      const lo=criteria.reduce((s,k)=>s+p.weights[k]*c.scores[k][0],0);
      const hi=criteria.reduce((s,k)=>s+p.weights[k]*c.scores[k][1],0);
      return {id:c.id,lo,hi,mid:(lo+hi)/2};
    });
    return {id:p.id,intervals,nominalLeaders:intervals.filter(a=>intervals.every(b=>a.mid>=b.mid-eps)).map(a=>a.id)};
  });
  const rows=eligible.map(c=>{
    let regret=0, limiting=null, robust=true;
    for(const p of summaries){
      const a=p.intervals.find(x=>x.id===c.id);
      for(const b of p.intervals)if(b.id!==a.id){
        const delta=b.hi-a.lo;
        if(delta>eps)robust=false;
        if(delta>regret){regret=delta;limiting={profile:p.id,rival:b.id}}
      }
    }
    return {id:c.id,worstRegret:regret,robust,limiting};
  }).sort((a,b)=>a.worstRegret-b.worstRegret || a.id.localeCompare(b.id));
  const robustLeaders=rows.filter(r=>r.robust).map(r=>r.id);
  const minimaxLeaders=rows.filter(r=>r.worstRegret<=rows[0].worstRegret+eps).map(r=>r.id);
  return {status:robustLeaders.length?"ROBUST_LEADER":"TRADEOFF",
    robustLeaders,minimaxLeaders,rows,profiles:summaries,excluded,
    authority:"DECLARED_DECISION_MODEL_ONLY"};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(decideTradeoff(JSON.parse(readFileSync(0,"utf8"))),null,2));
}
