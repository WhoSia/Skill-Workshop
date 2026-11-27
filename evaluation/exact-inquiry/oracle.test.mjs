import {readFileSync} from 'node:fs';
import {solveInquiry,verifyInquiry} from './oracle.mjs';
function testInquiry({solveInquiry,verifyInquiry},tasks){
 let checks=0;const ok=(x,m)=>{checks++;if(!x)throw Error(m)};
 const expected={"switch":[4,7],"selector4":[4,10],"parity":[6,6],"alias":null,"expensive-switch":[10,11]};
 const answer=o=>o.status==="possible"?{status:o.status,tree:o.adaptive.tree,fixedChannels:o.fixed.channels,adaptiveCost:o.adaptive.cost,fixedCost:o.fixed.cost}:{status:o.status,witness:o.witness};
 for(const t of tasks.cases){
  const o=solveInquiry(t),a=answer(o),e=expected[t.id];
  ok(e?o.adaptive.cost===e[0]&&o.fixed.cost===e[1]:o.status==="impossible","known costs");
  ok(verifyInquiry(t,a).pass,"certificate");
  if(e){ok(!verifyInquiry(t,{...a,adaptiveCost:a.adaptiveCost+1}).pass,"false reported cost");ok(!verifyInquiry(t,{...a,tree:{target:0}}).pass,"wrong policy");ok(!verifyInquiry(t,{...a,fixedChannels:[]}).pass,"inadequate fixed set");ok(!verifyInquiry(t,{...a,fixedChannels:[...a.fixedChannels,a.fixedChannels[0]]}).pass,"duplicate measurement")}
  else ok(!verifyInquiry(t,{...a,witness:["s0","s0"]}).pass,"false witness");
 }
 // Independently compute worst-case solvability by bounded budget decision recursion, not cost DP.
 function independent(t){
  const cost=t.channels.reduce((s,c)=>s+c.cost,0);
  const good=rows=>rows.every(x=>x.target===rows[0].target);
  function feasible(rows,remaining,unread){
   if(good(rows))return true;
   for(const c of unread)if(c.cost<=remaining){
    const a=rows.filter(r=>r.observations[c.id]===0),b=rows.filter(r=>r.observations[c.id]===1);
    if(a.length&&b.length&&feasible(a,remaining-c.cost,unread.filter(d=>d!==c))&&feasible(b,remaining-c.cost,unread.filter(d=>d!==c)))return true;
   }
   return false;
  }
  let adaptive=Infinity,fixed=Infinity;
  for(let b=0;b<=cost;b++)if(feasible(t.states,b,t.channels)){adaptive=b;break}
  // fixed sufficiency via pairwise constraints, independent of grouped encoding.
  const visit=(chosen,i,cost)=>{
   if(cost>=fixed)return;
   if(i===t.channels.length){
    for(const a of t.states)for(const b of t.states)if(a.target!==b.target&&!chosen.some(c=>a.observations[c.id]!==b.observations[c.id]))return;
    fixed=cost;return;
   }
   visit(chosen,i+1,cost);visit([...chosen,t.channels[i]],i+1,cost+t.channels[i].cost);
  };visit([],0,0);return {adaptive,fixed};
 }
 let seed=20261127;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32};let impossible=0,adaptiveGain=0;
 for(let k=0;k<180;k++){
  const channels=Array.from({length:1+Math.floor(rnd()*4)},(_,i)=>({id:"c"+i,cost:1+Math.floor(rnd()*3)}));
  const states=Array.from({length:1+Math.floor(rnd()*10)},(_,i)=>({id:"s"+i,target:Math.floor(rnd()*2),observations:Object.fromEntries(channels.map(c=>[c.id,Math.floor(rnd()*2)]))}));
  const t={channels,states},o=solveInquiry(t),r=independent(t);
  ok((o.adaptive?.cost??Infinity)===r.adaptive,"budget oracle");ok((o.fixed?.cost??Infinity)===r.fixed,"pair oracle");ok(verifyInquiry(t,answer(o),o).pass,"generated certificate");if(o.status==="impossible")impossible++;else if(o.adaptive.cost<o.fixed.cost)adaptiveGain++;
 }
 const t=tasks.cases.find(t=>t.id==="expensive-switch"),o=solveInquiry(t);
 // h,j then g only if h!=j has smaller mean but larger worst-case cost than minimax.
 const leaf=target=>({target});const g=(h,j)=>({channel:"g",branches:{"0":leaf(h),"1":leaf(j)}});
 const alternative={channel:"h",branches:{"0":{channel:"j",branches:{"0":leaf(0),"1":g(0,1)}},"1":{channel:"j",branches:{"0":g(1,0),"1":leaf(1)}}}};
 const a={...answer(o),tree:alternative,adaptiveCost:11};const r=verifyInquiry(t,a,o);
 ok(!r.pass&&r.reason==="valid but nonoptimal"&&r.adaptiveCost===11,"objective fidelity");
 let total=0;for(const s of t.states){let n=alternative,cost=0;while(!Object.hasOwn(n,"target")){cost+=t.channels.find(c=>c.id===n.channel).cost;n=n.branches[s.observations[n.channel]]}ok(n.target===s.target,"alternative correct");total+=cost}
 ok(total/t.states.length===6.5,"mean cost differs from minimax");
 return {checks,generated:180,impossible,adaptiveGain,alternativeUniformMean:6.5,alternativeWorst:11};
}
const tasks=JSON.parse(readFileSync(new URL('./tasks.json',import.meta.url),'utf8'));
console.log(JSON.stringify(testInquiry({solveInquiry,verifyInquiry},tasks),null,2));
