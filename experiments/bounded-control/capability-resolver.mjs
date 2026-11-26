/** Select providers for semantic obligations, not historical skill names.
 * All provider equivalence, source ordering and admission are caller-verified declarations.
 * No provider is executed here; no authority is created.
 */
export function resolveCapabilities({obligations,providers,budget,planObligations}){
 const str=x=>typeof x==="string"&&x.trim().length>0;
 if(typeof planObligations!=="function"||!Array.isArray(obligations)||!obligations.length||!Array.isArray(providers)||!Number.isSafeInteger(budget)||budget<0)throw Error("invalid capability request");
 const ids=new Set(),keys=new Set();
 const key=x=>JSON.stringify([x.contract,x.scope,x.revision]);
 for(const o of obligations){
  if(!o||!str(o.contract)||!str(o.scope)||!str(o.revision)||keys.has(key(o)))throw Error("invalid obligation");
  keys.add(key(o));
 }
 const candidates=[],excluded=[];
 for(const p of providers){
  if(!p||!str(p.id)||ids.has(p.id)||!Number.isSafeInteger(p.cost)||p.cost<1||!Array.isArray(p.offers)||!Array.isArray(p.requires))throw Error("invalid provider");
  ids.add(p.id);
  for(const o of [...p.offers,...p.requires])if(!o||!str(o.contract)||!str(o.scope)||!str(o.revision))throw Error("invalid port");
  if(p.available!==true||p.authorized!==true||p.equivalenceVerified!==true||p.current!==true||p.effect!=="local-readonly"){excluded.push(p.id);continue}
  candidates.push({id:"provider:"+p.id,cost:p.cost,requires:[...new Set(p.requires.map(key))],provides:[...new Set(p.offers.map(key))],available:true,authorized:true,effect:"local-readonly"});
 }
 // One synthetic mandatory terminal action costs one internal accounting unit.
 // It verifies nothing; it merely expresses the conjunction of required ports.
 if(candidates.length>19||budget>=Number.MAX_SAFE_INTEGER)throw Error("finite planner limit");
 const terminal={id:"terminal",cost:1,requires:[...keys],provides:[],available:true,authorized:true,effect:"local-readonly"};
 const p=planObligations({catalog:[...candidates,terminal],required:["terminal"],budget:budget+1,maxSteps:candidates.length+1});
 return {status:p.status==="PLAN"?"PLAN":"HOLD",providers:p.status==="PLAN"?p.plan.filter(id=>id!=="terminal").map(id=>id.slice(9)):[],cost:p.status==="PLAN"?p.cost-1:null,reason:p.reason??null,excluded,visited:p.visited,authority:"DECLARED_PROVIDER_COMPATIBILITY_ONLY"};
}
