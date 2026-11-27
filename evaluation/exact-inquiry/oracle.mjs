/** Exact finite binary observation design; no real-world identification claim. */
export function solveInquiry(task){
 const {channels,states}=task;
 if(!Array.isArray(channels)||channels.length>12||!Array.isArray(states)||!states.length||states.length>4096)throw Error("finite domain limit");
 const ids=channels.map(c=>c.id);
 if(new Set(ids).size!==ids.length||channels.some(c=>typeof c.id!=="string"||!c.id||!Number.isSafeInteger(c.cost)||c.cost<=0||c.cost>Number.MAX_SAFE_INTEGER/12)||new Set(states.map(s=>s.id)).size!==states.length||states.some(s=>typeof s.id!=="string"||!s.id||![0,1].includes(s.target)||ids.some(id=>![0,1].includes(s.observations?.[id]))))throw Error("invalid finite domain");
 const group=new Map();
 for(const s of states){const k=ids.map(id=>s.observations[id]).join("");if(group.has(k)&&group.get(k).target!==s.target)return {status:"impossible",witness:[group.get(k).id,s.id]};group.set(k,s)}
 const memo=new Map();
 function dp(rows,mask){
  if(rows.every(r=>r.target===rows[0].target))return {cost:0,tree:{target:rows[0].target}};
  const key=mask+":"+rows.map(r=>r.id).map(JSON.stringify).join(",");
  if(memo.has(key))return memo.get(key);
  let best=null;
  for(let i=0;i<channels.length;i++){
   if(mask&(1<<i))continue;
   const c=channels[i],a=rows.filter(r=>r.observations[c.id]===0),b=rows.filter(r=>r.observations[c.id]===1);
   if(!a.length||!b.length)continue;
   const x=dp(a,mask|(1<<i)),y=dp(b,mask|(1<<i)),cost=c.cost+Math.max(x.cost,y.cost);
   if(!best||cost<best.cost)best={cost,tree:{channel:c.id,branches:{"0":x.tree,"1":y.tree}}};
  }
  if(!best)throw Error("unresolved full observation");
  memo.set(key,best);return best;
 }
 let fixed=null;
 for(let mask=0;mask<2**channels.length;mask++){
  const chosen=channels.filter((_,i)=>mask&(1<<i)),cost=chosen.reduce((s,c)=>s+c.cost,0);
  if(fixed&&cost>=fixed.cost)continue;
  const seen=new Map();let good=true;
  for(const r of states){const k=chosen.map(c=>r.observations[c.id]).join("");if(seen.has(k)&&seen.get(k)!==r.target){good=false;break}seen.set(k,r.target)}
  if(good)fixed={cost,channels:chosen.map(c=>c.id)};
 }
 const adaptive=dp(states,0);
 return {status:"possible",adaptive,fixed,subproblems:memo.size};
}
export function verifyInquiry(task,answer,oracle=solveInquiry(task)){
 const fail=reason=>({pass:false,reason});
 if(!answer||answer.status!==oracle.status)return fail("wrong identification status");
 const rows=task.states,byId=new Map(rows.map(s=>[s.id,s])),costs=new Map(task.channels.map(c=>[c.id,c.cost]));
 if(answer.status==="impossible"){
  if(!Array.isArray(answer.witness)||answer.witness.length!==2)return fail("missing witness");
  const [a,b]=answer.witness.map(id=>byId.get(id));
  return a&&b&&a.target!==b.target&&task.channels.every(c=>a.observations[c.id]===b.observations[c.id])?{pass:true,status:"impossible"}:fail("invalid witness");
 }
 if(!Array.isArray(answer.fixedChannels)||new Set(answer.fixedChannels).size!==answer.fixedChannels.length||answer.fixedChannels.some(id=>!costs.has(id)))return fail("invalid fixed channels");
 let fixedCost=0;for(const id of answer.fixedChannels)fixedCost+=costs.get(id);
 const seen=new Map();
 for(const s of rows){const k=answer.fixedChannels.map(id=>s.observations[id]).join("");if(seen.has(k)&&seen.get(k)!==s.target)return fail("fixed set insufficient");seen.set(k,s.target)}
 function walk(node,subset,used,depth){
  if(!node||typeof node!=="object"||depth>costs.size)throw Error("invalid tree");
  if(Object.hasOwn(node,"target")){
   if(Object.keys(node).length!==1||![0,1].includes(node.target)||subset.some(s=>s.target!==node.target))throw Error("invalid leaf");
   return {worst:0,total:0};
  }
  if(Object.keys(node).length!==2||!costs.has(node.channel)||used.has(node.channel)||!node.branches||typeof node.branches!=="object")throw Error("invalid internal node");
  const groups=new Map();for(const s of subset){const k=String(s.observations[node.channel]);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(s)}
  if(Object.keys(node.branches).length!==groups.size||[...groups.keys()].some(k=>!Object.hasOwn(node.branches,k)))throw Error("wrong branches");
  let worst=0,total=0;for(const [k,rs] of groups){const r=walk(node.branches[k],rs,new Set([...used,node.channel]),depth+1);worst=Math.max(worst,r.worst);total+=r.total}
  return {worst:worst+costs.get(node.channel),total:total+subset.length*costs.get(node.channel)};
 }
 let result;try{result=walk(answer.tree,rows,new Set(),0)}catch(e){return fail(e.message)}
 if(fixedCost!==oracle.fixed.cost||result.worst!==oracle.adaptive.cost)return {...fail("valid but nonoptimal"),fixedCost,adaptiveCost:result.worst};
 if(answer.fixedCost!==fixedCost||answer.adaptiveCost!==result.worst)return fail("reported cost mismatch");
 return {pass:true,status:"possible",fixedCost,adaptiveCost:result.worst,uniformMeanCost:result.total/rows.length};
}
