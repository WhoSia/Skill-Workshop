import {compareMethods} from './method-composition.mjs';
function testMethods(compare){
  let checks=0;const ok=(x,m)=>{checks++;if(!x)throw Error(m)},eq=(a,b)=>Math.abs(a-b)<1e-10;
  const worlds=Array.from({length:4},(_,i)=>({id:"w"+i,decision:"d"+i,weight:1}));
  const m=(id,outcomes,cost=1,admitted=true)=>({id,outcomes,cost,admitted});
  let r=compare({worlds,methods:[m("gate",["L","L","R","R"]),m("left",["0","1","1","1"]),m("right",["1","1","0","1"])],budget:2});
  ok(eq(r.adaptive.accuracy,1)&&eq(r.fixed.utility,.75),"conditional specialization");
  ok(r.adaptive.policy.method==="gate","gate first");
  const branch=r;
  r=compare({worlds:worlds.map((w,i)=>({...w,decision:String((i>>1)^(i&1))})),methods:[m("a",["0","0","1","1"]),m("b",["0","1","0","1"])],budget:2,penalty:.04});
  ok(eq(r.adaptive.utility,.92)&&eq(r.fixed.utility,.92)&&eq(r.greedy.utility,.5),"XOR complementarity");
  const xor=r;
  r=compare({worlds,methods:[m("blocked",["0","1","2","3"],1,false),m("duplicate",["x","x","x","x"])],budget:2});
  ok(r.adaptive.policy.kind==="stop"&&eq(r.adaptive.utility,.25),"admission and no information");
  r=compare({worlds,methods:[m("full",["0","1","2","3"])],budget:1,penalty:.8});
  ok(r.adaptive.policy.kind==="stop","direct dominates costly method");
  let seed=20261127;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32};
  // Independent small-model oracle uses arrays of world indices and no bitmasks or memoization.
  function oracle(w,ms,b,p){
    const mass=xs=>xs.reduce((s,i)=>s+w[i].weight,0);
    function solve(xs,available,left){const counts={};for(const i of xs)counts[w[i].decision]=(counts[w[i].decision]||0)+w[i].weight;
      let best=Math.max(...Object.values(counts))/mass(xs);
      for(const j of available){const a=ms[j];if(!a.admitted||a.cost>left)continue;const groups={};for(const i of xs)(groups[a.outcomes[i]]??=[]).push(i);
        const v=Object.values(groups).reduce((sum,g)=>sum+mass(g)/mass(xs)*solve(g,available.filter(x=>x!==j),left-a.cost),-p*a.cost);best=Math.max(best,v)}
      return best;
    }return solve(w.map((_,i)=>i),ms.map((_,i)=>i),b);
  }
  let overFixed=0,overGreedy=0,stopCount=0,sumAdv=0;
  for(let t=0;t<300;t++){
    const w=Array.from({length:5},(_,i)=>({id:"w"+i,decision:"d"+Math.floor(rnd()*3),weight:1+Math.floor(rnd()*4)}));
    const ms=Array.from({length:4},(_,j)=>m("m"+j,w.map(()=>String(Math.floor(rnd()*3))),1+Math.floor(rnd()*2),rnd()>.1));
    const b=1+Math.floor(rnd()*4),p=.025*Math.floor(rnd()*5);
    const x=compare({worlds:w,methods:ms,budget:b,penalty:p});
    ok(eq(x.adaptive.utility,oracle(w,ms,b,p)),"exhaustive oracle");
    ok(eq(x.adaptive.utility,x.adaptive.policy.utility),"policy replay");
    ok(x.adaptive.utility+1e-10>=Math.max(x.fixed.utility,x.greedy.utility,x.direct.utility),"baseline dominance");
    if(x.adaptive.utility>x.fixed.utility+1e-10)overFixed++;
    if(x.adaptive.utility>x.greedy.utility+1e-10)overGreedy++;
    if(x.adaptive.policy.kind==="stop")stopCount++;
    sumAdv+=x.adaptive.utility-x.greedy.utility;
  }
  return {checks,trials:300,overFixed,overGreedy,stopCount,meanGreedyAdvantage:sumAdv/300,branch:{adaptive:branch.adaptive.utility,fixed:branch.fixed.utility,greedy:branch.greedy.utility,direct:branch.direct.utility},xor:{adaptive:xor.adaptive.utility,fixed:xor.fixed.utility,greedy:xor.greedy.utility,direct:xor.direct.utility},seed:20261127};
}
console.log(JSON.stringify(testMethods(compareMethods),null,2));
