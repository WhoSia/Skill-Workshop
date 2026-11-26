import {createEvidenceIndex} from './evidence-index.mjs';
import {resolveCapabilities} from './capability-resolver.mjs';
import {planObligations} from './obligation-planner.mjs';
import {createReuseRegistry} from './reuse-registry.mjs';
function testReuseRegistry({createEvidenceIndex,resolveCapabilities,planObligations,createReuseRegistry}){
 let checks=0;const ok=(v,m)=>{checks++;if(!v)throw Error(m)};
 const root=id=>({id,scope:"s",revision:"1",admitted:true,expiresAt:null});
 const index=createEvidenceIndex({roots:[root("a"),root("b")],nodes:[]}),reg=createReuseRegistry(index);
 const port=id=>({contract:id,scope:"s",revision:"1"}),a=port("a"),b=port("b");
 const provider=(id,p)=>({id,cost:2,offers:[p],requires:[],available:true,authorized:true,current:true,equivalenceVerified:true,effect:"local-readonly"});
 const req={obligations:[a,b],providers:[provider("redo-a",a),provider("redo-b",b)],budget:4,planObligations};
 const run=()=>reg.resolve(req,resolveCapabilities);
 const x=reg.begin(a,["a"]),y=reg.begin(b,["b"]);
 ok(reg.complete(x,{verified:true,port:a}),"commit a");ok(reg.complete(y,{verified:true,port:b}),"commit b");
 ok(run().cost===0,"reuse both");
 index.update({changes:[{id:"a",revision:"2"}]});ok(run().providers.join()==="redo-a"&&run().cost===2,"repair affected only");
 const z=reg.begin(a,["a"]);index.update({changes:[{id:"a",expiresAt:10}]});ok(!reg.complete(z,{verified:true,port:a}),"changed during execution");
 const q=reg.begin(a,["a"]);ok(!reg.complete(q,{verified:true,port:b}),"wrong output");
 const w=reg.begin(a,["a"]);ok(!reg.complete(w,{verified:false,port:a}),"failed result");
 let rejected=false;try{reg.complete(w,{verified:true,port:a})}catch{rejected=true}ok(rejected,"single use");
 rejected=false;try{reg.resolve({...req,verifiedFacts:[]},resolveCapabilities)}catch{rejected=true}ok(rejected,"no bypass");
 const k=reg.begin(a,["a"]);ok(reg.complete(k,{verified:true,port:a}),"reverified");ok(run().cost===0,"restored");
 index.update({nextAt:10});ok(run().cost===2,"expiry");
 // Independent simple root oracle for selective reuse, including change-and-revert.
 let seed=20261127;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32};
 let saved=0,full=0;
 for(let t=0;t<200;t++){
 const ids=Array.from({length:6},(_,i)=>"r"+i),g=createEvidenceIndex({roots:ids.map(root),nodes:[]}),r=createReuseRegistry(g);
 const ports=ids.map(port),live=new Set(ids),revisions=new Map(ids.map(id=>[id,"1"]));
 for(let i=0;i<ids.length;i++)r.complete(r.begin(ports[i],[ids[i]]),{verified:true,port:ports[i]});
 for(let j=0;j<5;j++){
 const id=ids[Math.floor(rnd()*ids.length)],revision=String(1+Math.floor(rnd()*3));
 if(revision!==revisions.get(id))live.delete(id);revisions.set(id,revision);
 g.update({changes:[{id,revision}]});
 const result=r.resolve({obligations:ports,providers:ports.map(p=>provider(p.contract,p)),budget:12,planObligations},resolveCapabilities);
 ok(result.cost===2*(6-live.size),"oracle cost");ok(result.providers.every(x=>!live.has(x)),"no unnecessary execution");
 saved+=2*live.size;full+=12;
 }
 }
 return {checks,generatedUpdates:1000,fullDeclaredCost:full,savedDeclaredCost:saved,seed:20261127};
}
console.log(JSON.stringify(testReuseRegistry({createEvidenceIndex,resolveCapabilities,planObligations,createReuseRegistry}),null,2));
