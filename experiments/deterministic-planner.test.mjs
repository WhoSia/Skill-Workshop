import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planDeterministic} from './deterministic-planner.mjs';
// Independent exhaustive array-partition oracle, no memoization.
function oracle(worlds, probes, budget, depth, rows=worlds.map((_,i)=>i)) {
  const masses=new Map();for(const i of rows){const w=worlds[i];masses.set(w.target,(masses.get(w.target)||0)+w.weight);}
  let best=Math.max(...masses.values());if(depth===0)return best;
  for(const p of probes){if(p.cost>budget)continue;const groups=new Map();for(const i of rows){const k=p.signature[i];if(!groups.has(k))groups.set(k,[]);groups.get(k).push(i);}
    if(groups.size<2)continue;let v=0;for(const g of groups.values())v+=oracle(worlds,probes.filter(q=>q!==p),budget-p.cost,depth-1,g);best=Math.max(best,v);}
  return best;
}
const xor={worlds:['even','odd','odd','even'].map(target=>({target,weight:1})),probes:[{id:'A',cost:1,signature:['0','0','1','1']},{id:'B',cost:1,signature:['0','1','0','1']}],budget:2,depth:2};
test('complementary observations: one probe cannot identify target, two can',()=>{assert.equal(planDeterministic({...xor,depth:1}).value,.5);assert.equal(planDeterministic(xor).value,1);});
test('shared noise not double counted: identical noisy proxies cannot identify target',()=>{const s={...xor,probes:[xor.probes[0],{...xor.probes[0],id:'duplicate'}]};assert.equal(planDeterministic(s).value,.5);});
test('cost and horizon respected',()=>{assert.equal(planDeterministic({...xor,budget:1}).value,.5);assert.equal(planDeterministic({...xor,depth:0}).action,null);});
test('invalid models fail closed',()=>{assert.throws(()=>planDeterministic({...xor,probes:[{...xor.probes[0],cost:0}]}),TypeError);});
test('all connected labeled four-vertex graphs: exact distance-probe oracle agreement',()=>{let graphs=0,cases=0;const edges=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
 for(let mask=0;mask<64;mask++){const d=Array.from({length:4},(_,i)=>Array.from({length:4},(_,j)=>i===j?0:99));edges.forEach(([i,j],k)=>{if(mask&(1<<k))d[i][j]=d[j][i]=1;});for(let k=0;k<4;k++)for(let i=0;i<4;i++)for(let j=0;j<4;j++)d[i][j]=Math.min(d[i][j],d[i][k]+d[k][j]);if(d.some(r=>r.includes(99)))continue;graphs++;
  for(const weights of [[1,1,1,1],[1,2,3,4]])for(let b=0;b<=3;b++){const worlds=weights.map((weight,i)=>({target:String(i),weight}));const probes=d.map((r,i)=>({id:String(i),cost:1,signature:r.map(String)}));const v=planDeterministic({worlds,probes,budget:b,depth:b}).value;const ref=oracle(worlds,probes,b,b)/weights.reduce((a,c)=>a+c,0);assert.ok(Math.abs(v-ref)<1e-12);cases++;}}
 assert.equal(graphs,38);assert.equal(cases,304);console.log({graphs,cases});});
