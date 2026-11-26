/** Exact bounded refinement selection over caller-declared finite observations. Costs and admission are trusted declarations, not real-world measurements. */
export function selectRefinement({rows,channels,budget}){
 const str=x=>typeof x==="string"&&x.length>0;
 if(!Array.isArray(rows)||!rows.length||!Array.isArray(channels)||channels.length>12||!Number.isSafeInteger(budget)||budget<0)throw Error("invalid finite refinement model");
 const ids=new Set(),cs=new Set();
 for(const c of channels){if(!c||!str(c.id)||cs.has(c.id)||!Number.isSafeInteger(c.cost)||c.cost<1||c.cost>Number.MAX_SAFE_INTEGER/12)throw Error("invalid channel");cs.add(c.id)}
 const usable=channels.filter(c=>c.admitted===true);
 for(const r of rows){if(!r||!str(r.id)||ids.has(r.id)||!str(r.observation)||!str(r.target)||!r.values||usable.some(c=>!Object.hasOwn(r.values,c.id)||!str(r.values[c.id])))throw Error("invalid or missing state observation");ids.add(r.id)}
 function partition(group,key){const map=new Map();for(const r of group){const k=key(r);if(!map.has(k))map.set(k,[]);map.get(k).push(r)}return [...map.values()]}
 const mixed=g=>g.some(r=>r.target!==g[0].target);
 const initial=partition(rows,r=>r.observation).filter(mixed);
 let best=null,visited=0,refinements=0;
 function search(groups,start,cost,selected){
  visited++;
  if(!groups.length){if(!best||cost<best.cost)best={cost,channels:[...selected]};return}
  if(best&&cost>=best.cost)return;
  for(let j=start;j<usable.length;j++){
   const c=usable[j],nextCost=cost+c.cost;
   if(nextCost>budget||(best&&nextCost>=best.cost))continue;
   let split=false;const next=[];
   for(const g of groups){const pieces=partition(g,r=>r.values[c.id]);refinements+=g.length;if(pieces.length>1)split=true;for(const p of pieces)if(mixed(p))next.push(p)}
   // A channel constant on every currently mixed group cannot separate any later sub-group.
   if(split)search(next,j+1,nextCost,[...selected,c.id]);
  }
 }
 search(initial,0,0,[]);
 return {status:best?"REFINEMENT_FOUND":"NO_REFINEMENT_WITHIN_DECLARED_BUDGET",plan:best,initialAmbiguousFibers:initial.length,visited,refinements,authority:"FINITE_DECLARED_OBSERVATION_MODEL_ONLY"};
}
