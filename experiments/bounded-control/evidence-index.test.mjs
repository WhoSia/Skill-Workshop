import {createEvidenceIndex} from './evidence-index.mjs';
function runEvidenceTests(make){
  let assertions=0;const ok=(b,m)=>{assertions++;if(!b)throw Error(m)};
  const p=id=>({id,scope:"test"}),r=(id,admitted=true)=>({id,scope:"test",revision:"1",admitted,expiresAt:null});
  const n=(id,...alternatives)=>({id,scope:"test",alternatives:alternatives.map(a=>a.map(p))});
  let g=make({roots:[r("a"),r("b")],nodes:[n("either",["a"],["b"]),n("both",["a","b"]),n("later",["either"])]});
  let q=g.update({changes:[{id:"a",admitted:false}]});let s=g.snapshot();
  ok(s[2].eligible&&!s[3].eligible&&s[4].eligible,"alternative survives");
  ok(q.changed.includes("later")&&s[4].roots.length===1,"lineage change travels despite eligibility");
  q=g.update({changes:[{id:"b",revision:"2"}]});ok(q.changed.includes("later")&&g.snapshot()[4].roots[0][1]==="2","revision travels");
  let before=JSON.stringify(g.snapshot());try{g.update({changes:[{id:"b",admitted:false},{id:"missing",revision:"x"}]});throw Error("unexpected pass")}catch(e){ok(e.message!=="unexpected pass","invalid batch rejected")}
  ok(JSON.stringify(g.snapshot())===before,"atomic invalid batch");
  g=make({roots:[{...r("a"),expiresAt:5}],nodes:[n("x",["a"])]});g.update({nextAt:5});ok(!g.snapshot()[1].eligible,"exclusive expiry");
  g.update({changes:[{id:"a",expiresAt:6}]});ok(g.snapshot()[1].eligible,"expiry renewal");
  try{g.update({nextAt:4});throw Error("unexpected pass")}catch(e){ok(e.message!=="unexpected pass","time rollback rejected")}
  for(const nodes of [[{id:"x",scope:"test",alternatives:[[{id:"a",scope:"wrong"}]]}],[n("x",["x"])],[n("x",["a","a"])],[n("x",[])]]){
    try{make({roots:[r("a")],nodes});throw Error("unexpected pass")}catch(e){ok(e.message!=="unexpected pass","invalid graph rejected")}
  }
  // Independent oracle: reconstruct every justification by fresh topological evaluation without incremental state.
  let seed=20261127;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32};
  let trials=0,local=0,full=0,rootChecks=0;
  for(let t=0;t<300;t++){
    const roots=Array.from({length:8},(_,i)=>({...r("r"+i,rnd()<.8),expiresAt:rnd()<.25?1+Math.floor(rnd()*4):null}));
    const nodes=[],ids=roots.map(x=>x.id);
    for(let i=0;i<32;i++){const alt=Array.from({length:1+Math.floor(rnd()*3)},()=>[...new Set(Array.from({length:1+Math.floor(rnd()*2)},()=>ids[Math.floor(rnd()*ids.length)]))]);nodes.push(n("n"+i,...alt));ids.push("n"+i)}
    const x=make({roots,nodes});const model=new Map(roots.map(z=>[z.id,{...z}]));let now=0;
    for(let k=0;k<4;k++){
      const z=roots[Math.floor(rnd()*roots.length)].id;
      const patch=k%2?{id:z,revision:"r"+k}:{id:z,admitted:!model.get(z).admitted};
      Object.assign(model.get(z),patch);now++;
      const report=x.update({changes:[patch],nextAt:now});local+=report.derivedEvaluations;rootChecks+=report.rootChecks;full+=nodes.length;
      const independent=new Map();
      for(const id of ids){
        const root=model.get(id);
        if(root){const eligible=root.admitted&&(root.expiresAt===null||now<root.expiresAt);independent.set(id,{eligible,roots:eligible?[[id,root.revision]]:[],active:[]});continue}
        const d=nodes.find(y=>y.id===id),active=[],tokens=new Map();
        d.alternatives.forEach((a,j)=>{if(a.every(v=>independent.get(v.id).eligible)){active.push(j);for(const v of a)for(const token of independent.get(v.id).roots)tokens.set(JSON.stringify(token),token)}});
        independent.set(id,{eligible:active.length>0,roots:[...tokens.keys()].sort().map(k=>tokens.get(k)),active});
      }
      ok(x.snapshot().every(v=>{const z=independent.get(v.id);return v.eligible===z.eligible&&JSON.stringify(v.roots)===JSON.stringify(z.roots)&&JSON.stringify(v.active)===JSON.stringify(z.active)}),"oracle mismatch "+t+":"+k);trials++;
    }
  }
  return {assertions,trials,localDerivedEvaluations:local,fullDerivedEvaluations:full,rootChecks,seed:20261127};
}
console.log(JSON.stringify(runEvidenceTests(createEvidenceIndex),null,2));
