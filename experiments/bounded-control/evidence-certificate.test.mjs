import {createEvidenceIndex} from './evidence-index.mjs';
function testCertificates(make){
 const r=(id,expiresAt=null)=>({id,scope:"s",revision:"1",admitted:true,expiresAt});
 const n=(id,...alts)=>({id,scope:"s",alternatives:alts.map(a=>a.map(id=>({id,scope:"s"})))});
 let checks=0;const ok=(b,m)=>{checks++;if(!b)throw Error(m)};
 const g=make({roots:[r("a",10),r("b"),r("c")],nodes:[n("left",["a"],["a","b"]),n("all",["left"],["b"]),n("unrelated",["c"])]});
 const top=g.capture(["all"]),unrelated=g.capture(["unrelated"]);
 const snap=JSON.stringify(g.snapshot());let q=g.update({changes:[{id:"a",expiresAt:20}]});
 ok(JSON.stringify(g.snapshot())===snap,"same structural snapshot");
 ok(q.changed.length===0&&q.certificateChanged.includes("all"),"metadata propagates");
 ok(!g.isCurrent(top)&&g.isCurrent(unrelated),"selective invalidation");
 const t=g.capture(["all"]);g.update({changes:[{id:"a",expiresAt:10}]});ok(!g.isCurrent(t)&&!g.isCurrent(top),"no resurrection");
 const fresh=g.capture(["all"]);g.update({nextAt:1});ok(g.isCurrent(fresh),"unchanged time eligibility");
 g.update({changes:[{id:"b",admitted:false}]});ok(!g.isCurrent(fresh),"alternate path changed");
 const last=g.capture(["all"]);g.update({nextAt:10});ok(!g.isCurrent(last),"expiry");
 ok(!g.isCurrent({ids:["all"]})&&!g.isCurrent(null),"forged token");
 let reject=false;try{g.capture(["all"])}catch{reject=true}ok(reject,"ineligible capture");
 const other=make({roots:[r("a")],nodes:[]});ok(!other.isCurrent(unrelated),"cross-instance");
 const h=make({roots:[r("a"),r("b")],nodes:[n("left",["a"],["b"]),n("right",["a","b"]),n("parent",["left","right"])]});
 const htoken=h.capture(["parent"]);h.update({changes:[{id:"a",expiresAt:99}]});ok(!h.isCurrent(htoken),"shared ancestry stamp");
 const valid=h.capture(["parent"]);try{h.update({changes:[{id:"a",expiresAt:1},{id:"z",revision:"2"}]})}catch{}ok(h.isCurrent(valid),"invalid batch does not invalidate");
 // Independent prospective read-set oracle: fully expand active justification trees, compare their exact structure and root metadata.
 let seed=20261127;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32};
 for(let i=0;i<300;i++){
  const roots=Array.from({length:4},(_,j)=>r("r"+j)),nodes=[],ids=roots.map(x=>x.id);
  for(let j=0;j<8;j++){const alts=Array.from({length:2},()=>[...new Set(Array.from({length:2},()=>ids[Math.floor(rnd()*ids.length)]))]);nodes.push(n("n"+j,...alts));ids.push("n"+j)}
  const graph=make({roots,nodes});const model=new Map(roots.map(x=>[x.id,{...x}]));
  function proof(id,now){const root=model.get(id);if(root)return root.admitted&&(root.expiresAt===null||now<root.expiresAt)?["root",id,root.revision,root.admitted,root.expiresAt]:null;
   const d=nodes.find(x=>x.id===id);const active=d.alternatives.map((a,k)=>[k,a.map(p=>proof(p.id,now))]).filter(([,p])=>p.every(Boolean));return active.length?["derived",id,active]:null}
  let now=0;
  for(let k=0;k<4;k++){const chosen=ids[Math.floor(rnd()*ids.length)],prior=proof(chosen,now);const token=prior?graph.capture([chosen]):null;
   const id=roots[Math.floor(rnd()*roots.length)].id;const patch=k%2?{id,expiresAt:now+3}:{id,admitted:!model.get(id).admitted};Object.assign(model.get(id),patch);now++;
   graph.update({changes:[patch],nextAt:now});const next=proof(chosen,now);if(token)ok(graph.isCurrent(token)===(JSON.stringify(prior)===JSON.stringify(next)),"independent proof equality");
  }
 }
 return {checks,generatedGraphs:300,updates:1200,seed:20261127};
}
console.log(JSON.stringify(testCertificates(createEvidenceIndex),null,2));
