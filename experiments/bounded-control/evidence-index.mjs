/** Experimental fixed-DAG evidence index. Caller-supplied admission is trusted; eligibility is not scientific validity. Root lineage is a union, not independence or a proof. */
export function createEvidenceIndex({roots,nodes,at=0}){
  const fail=m=>{throw new Error(m)};
  const str=x=>typeof x==="string"&&x.trim().length>0;
  const time=x=>Number.isSafeInteger(x)&&x>=0;
  if(!Array.isArray(roots)||!Array.isArray(nodes)||!time(at))fail("invalid graph");
  const defs=[], byId=new Map(), states=[], children=[], rootIds=[];
  const add=(id,scope,kind)=>{if(!str(id)||!str(scope)||byId.has(id))fail("invalid identity or scope");const i=defs.length;byId.set(id,i);defs.push({id,scope,kind});children.push(new Set());return i};
  const validateRoot=r=>{if(!str(r.revision)||typeof r.admitted!=="boolean"||(r.expiresAt!==null&&!time(r.expiresAt)))fail("invalid root state")};
  const input=[];
  for(const r of roots){validateRoot(r);const i=add(r.id,r.scope,"root");rootIds.push(i);input[i]={revision:r.revision,admitted:r.admitted,expiresAt:r.expiresAt}}
  for(const n of nodes){
    if(!Array.isArray(n.alternatives)||!n.alternatives.length)fail("no justifications");
    const alternatives=n.alternatives.map(a=>{
      if(!Array.isArray(a)||!a.length)fail("empty justification");
      const refs=a.map(p=>{const j=byId.get(p.id);if(j===undefined||defs[j].scope!==p.scope)fail("missing, forward, or scope-incompatible port");return j});
      if(new Set(refs).size!==refs.length)fail("duplicate dependency");
      return refs;
    });
    const i=add(n.id,n.scope,"derived");defs[i].alternatives=alternatives;
    for(const a of alternatives)for(const j of a)children[j].add(i);
  }
  function calculate(i){
    const d=defs[i];
    if(d.kind==="root"){
      const r=input[i],eligible=r.admitted&&(r.expiresAt===null||at<r.expiresAt);
      return {eligible,roots:eligible?[JSON.stringify([d.id,r.revision])]:[],active:[]};
    }
    const active=[],tokens=new Set();
    for(let k=0;k<d.alternatives.length;k++){
      const a=d.alternatives[k];
      if(a.every(j=>states[j].eligible)){active.push(k);for(const j of a)for(const token of states[j].roots)tokens.add(token)}
    }
    return {eligible:active.length>0,roots:[...tokens].sort(),active};
  }
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  for(let i=0;i<defs.length;i++)states[i]=calculate(i);
  function snapshot(){
    return defs.map((d,i)=>({id:d.id,scope:d.scope,kind:d.kind,eligible:states[i].eligible,roots:states[i].roots.map(x=>JSON.parse(x)),active:[...states[i].active]}));
  }
  function update({changes=[],nextAt=at}={}){
    if(!Array.isArray(changes)||!time(nextAt)||nextAt<at)fail("invalid time or changes");
    const pendingRoots=new Map();
    for(const c of changes){
      const i=byId.get(c.id);
      if(i===undefined||defs[i].kind!=="root"||pendingRoots.has(i)||Object.keys(c).some(k=>!["id","revision","admitted","expiresAt"].includes(k)))fail("invalid root update");
      const r={...input[i]};for(const k of ["revision","admitted","expiresAt"])if(Object.hasOwn(c,k))r[k]=c[k];
      validateRoot(r);pendingRoots.set(i,r);
    }
    // All input validation happens before mutation.
    at=nextAt;for(const [i,r] of pendingRoots)input[i]=r;
    const queue=new Set(),changed=[];let derivedEvaluations=0;
    const refresh=i=>{const next=calculate(i);if(!same(states[i],next)){states[i]=next;changed.push(defs[i].id);for(const j of children[i])queue.add(j)}};
    for(const i of rootIds)refresh(i);
    while(queue.size){let i=Infinity;for(const j of queue)if(j<i)i=j;queue.delete(i);derivedEvaluations++;refresh(i)}
    return {changed,rootChecks:rootIds.length,derivedEvaluations,authority:"STRUCTURAL_ELIGIBILITY_ONLY"};
  }
  return {snapshot,update};
}
