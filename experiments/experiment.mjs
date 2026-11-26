import { createHash } from 'node:crypto';
const hash = text => createHash('sha256').update(text).digest('hex');
const entropy = p => -p.reduce((s,x)=>s+(x ? x*Math.log2(x):0),0);
const valid = p => Array.isArray(p) && p.length>0 && p.every(x=>Number.isFinite(x)&&x>=0&&x<=1) && Math.abs(p.reduce((a,b)=>a+b,0)-1)<1e-9;
const targetEntropy = (p,targets) => {
  const mass=new Map();
  p.forEach((x,i)=>mass.set(targets[i],(mass.get(targets[i])??0)+x));
  return entropy([...mass.values()]);
};
const targetConfidence = (p,targets) => {
  const mass=new Map();
  p.forEach((x,i)=>mass.set(targets[i],(mass.get(targets[i])??0)+x));
  return Math.max(...mass.values());
};
const predictive = (p,e) => e.outcomes.map((_,j)=>p.reduce((s,x,i)=>s+x*e.likelihood[i][j],0));
const posterior = (p,e,j,q) => p.map((x,i)=>x*e.likelihood[i][j]/q[j]);
export function informationGain(p,e,targets=p.map((_,i)=>i)) {
  const q=predictive(p,e);
  return Math.max(0,targetEntropy(p,targets)-q.reduce((s,x,j)=>s+(x?x*targetEntropy(posterior(p,e,j,q),targets):0),0));
}
// Exact expected target-entropy reduction for a bounded decision tree.
function planValue(p, experiments, budget, depth, targets) {
  if(depth===0||budget===0)return 0;
  let best=0;
  for(const e of experiments){
    if(e.cost>budget)continue;
    best=Math.max(best,actionValue(p,e,experiments,budget,depth,targets));
  }
  return best;
}
function actionValue(p,e,experiments,budget,depth,targets){
  const q=predictive(p,e),rest=experiments.filter(x=>x.id!==e.id);
  return informationGain(p,e,targets)+q.reduce((s,x,j)=>s+(x?x*planValue(posterior(p,e,j,q),rest,budget-e.cost,depth-1,targets):0),0);
}
export async function runResearch(spec, observe, {policy='information',depth=2}={}) {
  // Freeze the scientific design before any observation; never send private data to a tool.
  const design=structuredClone(spec);
  const {goal,rivals,experiments,budget,threshold=0.99}=design;
  if(typeof goal!=='string'||!goal.trim()||!Array.isArray(rivals)||rivals.length<2||new Set(rivals).size!==rivals.length||!Number.isSafeInteger(budget)||budget<0||!Number.isFinite(threshold)||threshold<=0.5||threshold>1||!['information','fixed','lookahead'].includes(policy)||!Array.isArray(experiments)) throw new TypeError('invalid design');
  let p=design.prior??rivals.map(()=>1/rivals.length);
  if(!valid(p)||p.length!==rivals.length) throw new TypeError('invalid prior');
  const targets=design.targets??rivals;
  if(!Array.isArray(targets)||targets.length!==rivals.length||targets.some(x=>typeof x!=='string')||new Set(targets).size<2||!Number.isInteger(depth)||depth<1||depth>3)throw new TypeError('invalid targets/depth');
  if(policy==='lookahead'&&(experiments.length>16||rivals.length>32||experiments.some(e=>e.outcomes?.length>4)))throw new RangeError('lookahead limits exceeded');
  const ids=new Set();
  for(const e of experiments){
    if(typeof e.id!=='string'||!e.id||ids.has(e.id)||!Number.isSafeInteger(e.cost)||e.cost<=0||!Array.isArray(e.outcomes)||e.outcomes.length<2||e.outcomes.some(x=>typeof x!=='string')||new Set(e.outcomes).size!==e.outcomes.length||!Array.isArray(e.likelihood)||e.likelihood.length!==rivals.length||e.likelihood.some(x=>!valid(x)||x.length!==e.outcomes.length)) throw new TypeError('invalid experiment');
    ids.add(e.id);
  }
  const designHash=hash(JSON.stringify(design)), trace=[];
  let remaining=budget,status='BUDGET_OR_NO_EXPERIMENT';
  while(true){
    if(targetConfidence(p,targets)>=threshold){status='MODEL_CONDITIONAL_THRESHOLD';break;}
    const candidates=experiments.filter(e=>e.cost<=remaining&&!trace.some(t=>t.id===e.id)).map(e=>({e,gain:informationGain(p,e,targets)}));
    if(!candidates.length)break;
    if(policy==='information')candidates.sort((a,b)=>b.gain/b.e.cost-a.gain/a.e.cost||a.e.cost-b.e.cost||a.e.id.localeCompare(b.e.id,'en'));
    if(policy==='lookahead'){
      const available=candidates.map(x=>x.e);
      for(const c of candidates)c.value=actionValue(p,c.e,available,remaining,depth,targets);
      candidates.sort((a,b)=>b.value-a.value||a.e.cost-b.e.cost||a.e.id.localeCompare(b.e.id,'en'));
      if(candidates[0].value<1e-12){status='NO_DISCRIMINATING_EXPERIMENT';break;}
    }
    const {e,gain}=candidates[0];
    if(policy==='information'&&gain<1e-12){status='NO_DISCRIMINATING_EXPERIMENT';break;}
    remaining-=e.cost;
    const before=[...p];let result;
    try{result=await observe(structuredClone(e));}catch{trace.push({id:e.id,cost:e.cost,gain,before,status:'EXECUTION_FAILED'});status='HOLD';break;}
    const j=e.outcomes.indexOf(result),q=predictive(p,e);
    if(j<0||q[j]<=0){trace.push({id:e.id,cost:e.cost,gain,before,status:'OUT_OF_MODEL'});status='HOLD';break;}
    p=posterior(p,e,j,q);
    trace.push({id:e.id,cost:e.cost,gain,before,observation:result,after:[...p],status:'OBSERVED'});
  }
  return {designHash,policy,depth,status,remaining,posterior:p,targets,trace,authority:'MODEL_CONDITIONAL_ONLY'};
}
