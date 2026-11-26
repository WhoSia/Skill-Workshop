/** Finite deterministic observation model. All admissions, priors and outcomes are declared by the caller, not learned or scientifically verified. */
export function compareMethods({worlds,methods,budget,penalty=0}) {
  const fail=()=>{throw Error("invalid finite decision model")};
  const str=x=>typeof x==="string"&&x.length>0;
  if(!Array.isArray(worlds)||!worlds.length||worlds.length>16||!Array.isArray(methods)||methods.length>10||!Number.isSafeInteger(budget)||budget<0||!Number.isFinite(penalty)||penalty<0||penalty>1)fail();
  const ids=new Set(), ws=worlds.map(w=>{if(!str(w.id)||ids.has(w.id)||!str(w.decision)||!Number.isSafeInteger(w.weight)||w.weight<1||w.weight>1e8)fail();ids.add(w.id);return {...w}});
  const mids=new Set(), ms=methods.map(m=>{if(!str(m.id)||mids.has(m.id)||!Number.isSafeInteger(m.cost)||m.cost<1||!Array.isArray(m.outcomes)||m.outcomes.length!==ws.length||!m.outcomes.every(str))fail();mids.add(m.id);return {...m,outcomes:[...m.outcomes]}}).filter(m=>m.admitted===true);
  const all=(1<<ws.length)-1, eps=1e-12;
  function mass(mask){let v=0;for(let i=0;i<ws.length;i++)if(mask&(1<<i))v+=ws[i].weight;return v}
  function stop(mask){const totals=new Map();for(let i=0;i<ws.length;i++)if(mask&(1<<i))totals.set(ws[i].decision,(totals.get(ws[i].decision)||0)+ws[i].weight);const [decision,w]=[...totals].sort((a,b)=>b[1]-a[1]||(a[0]<b[0]?-1:a[0]>b[0]?1:0))[0];return {utility:w/mass(mask),kind:"stop",decision}}
  function split(mask,m){const p=new Map();for(let i=0;i<ws.length;i++)if(mask&(1<<i)){const o=m.outcomes[i];p.set(o,(p.get(o)||0)|(1<<i))}return p}
  const memo=new Map();
  function adaptive(mask,used,left,greedy=false){
    const key=[mask,used,left].join(":");
    if(!greedy&&memo.has(key))return memo.get(key);
    let best=stop(mask);
    for(let j=0;j<ms.length;j++){const m=ms[j];if((used&(1<<j))||m.cost>left)continue;
      const groups=split(mask,m);if(groups.size<2)continue;
      let utility=-penalty*m.cost;const branches=[];
      for(const [o,g] of groups){const child=greedy?stop(g):adaptive(g,used|(1<<j),left-m.cost);utility+=mass(g)/mass(mask)*child.utility;branches.push({outcome:o,next:child})}
      if(utility>best.utility+eps)best={kind:"method",method:m.id,utility,branches,j};
    }
    if(greedy&&best.kind==="method"){const m=ms[best.j];best={...best,branches:[...split(mask,m)].map(([outcome,g])=>({outcome,next:adaptive(g,used|(1<<best.j),left-m.cost,true)}))}}
    if(!greedy)memo.set(key,best);return best;
  }
  let fixed={utility:stop(all).utility,methods:[]};
  for(let sub=1;sub<(1<<ms.length);sub++){
    let cost=0,groups=[all],chosen=[];
    for(let j=0;j<ms.length;j++)if(sub&(1<<j)){cost+=ms[j].cost;chosen.push(ms[j].id);groups=groups.flatMap(g=>[...split(g,ms[j]).values()])}
    if(cost>budget)continue;
    const utility=groups.reduce((s,g)=>s+mass(g)/mass(all)*stop(g).utility,0)-penalty*cost;
    if(utility>fixed.utility+eps)fixed={utility,methods:chosen};
  }
  function replay(policy){let correct=0,cost=0;for(let i=0;i<ws.length;i++){let p=policy,c=0;while(p.kind==="method"){const m=ms.find(x=>x.id===p.method);c+=m.cost;p=p.branches.find(b=>b.outcome===m.outcomes[i]).next}if(c>budget)throw Error("budget invariant");cost+=ws[i].weight*c;if(p.decision===ws[i].decision)correct+=ws[i].weight}return {accuracy:correct/mass(all),expectedCost:cost/mass(all),utility:(correct-penalty*cost)/mass(all)}}
  const opt=adaptive(all,0,budget),greedy=adaptive(all,0,budget,true);
  return {direct:stop(all),fixed,adaptive:{policy:opt,...replay(opt)},greedy:{policy:greedy,...replay(greedy)},states:memo.size,authority:"FINITE_DECLARED_MODEL_ONLY"};
}
