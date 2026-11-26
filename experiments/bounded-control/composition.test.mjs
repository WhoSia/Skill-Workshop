import {createEvidenceIndex} from './evidence-index.mjs';
import {fiberAudit} from './fiber-audit.mjs';
import {selectRefinement} from './refinement-selector.mjs';
import {runContractLoop} from './obligation-planner.mjs';
import {contrastAudit} from './contrast-audit.mjs';
function compositionTests({createEvidenceIndex,fiberAudit,selectRefinement,runContractLoop,contrastAudit}){
 let checks=0;const ok=(b,m)=>{checks++;if(!b)throw Error(m)};
 const rows=Array.from({length:4},(_,i)=>({id:String(i),observation:"same",property:String((i>>1)^(i&1)),target:String((i>>1)^(i&1)),values:{a:String(i>>1),b:String(i&1),full:String(i)}}));
 const obstruction=fiberAudit(rows);ok(obstruction.status==="COUNTEREXAMPLE","detect");
 const plan=selectRefinement({rows,channels:[{id:"a",cost:1,admitted:true},{id:"b",cost:1,admitted:true},{id:"full",cost:3,admitted:true}],budget:2});ok(plan.plan?.cost===2,"joint refinement");
 const a=(id,requires,provides,cost)=>({id,requires,provides,cost,available:true,authorized:true,effect:"local-readonly"});
 const catalog=[...plan.plan.channels.map(id=>a(id,[],[id],1)),a("audit",plan.plan.channels,["checked"],1)];
 const executed=runContractLoop({goal:"test enumerated observation refinement",catalog,required:["audit"],budget:3,score:()=>.5,execute:action=>{
  if(action.id==="audit"){const refined=rows.map(r=>({...r,observation:JSON.stringify([r.observation,...plan.plan.channels.map(id=>r.values[id])])}));if(fiberAudit(refined).status!=="CONSTANT_ON_ENUMERATED_FIBERS")return {status:"failed"}}
  return {status:"verified",facts:action.provides};
 }});ok(executed.reason==="obligations-satisfied"&&executed.remaining===0,"actual composed audit");
 const root=id=>({id,scope:"finite-fixture",revision:"1",admitted:true,expiresAt:10});
 const graph=createEvidenceIndex({roots:plan.plan.channels.map(root),nodes:[{id:"audit",scope:"finite-fixture",alternatives:[plan.plan.channels.map(id=>({id,scope:"finite-fixture"}))]}]});
 const cert=graph.capture(["audit"]);ok(graph.isCurrent(cert),"receipt current");
 graph.update({changes:[{id:"a",expiresAt:11}]});ok(!graph.isCurrent(cert)&&graph.snapshot().find(x=>x.id==="audit").eligible,"stale despite eligibility");
 const q=contrastAudit({target:"finite fixture comparisons",orientation:"higher",required:["native","strong"],observed:{value:8,scope:"same"},rivals:[{id:"native",value:7,scope:"same"},{id:"strong",value:9,scope:"same"}]});
 ok(q.sign==="reversal"&&q.complete,"rival reversal survives");
 const p=contrastAudit({target:"finite fixture comparisons",orientation:"higher",required:["native","strong"],observed:{value:8,scope:"same"},rivals:[{id:"native",value:7,scope:"same"}]});
 ok(!p.complete&&p.action==="complete-comparison","missing strong rival");
 const failed=runContractLoop({goal:"test blocked observation",catalog,required:["audit"],budget:3,score:()=>.5,execute:action=>action.id==="a"?{status:"failed"}:{status:"verified",facts:action.provides}});ok(failed.pending.includes("audit")&&!failed.facts.includes("checked"),"no downstream verification after failed prerequisite");
 return {checks,authority:"SYNTHETIC_COMPONENT_COMPOSITION_ONLY"};
}
console.log(JSON.stringify(compositionTests({createEvidenceIndex,fiberAudit,selectRefinement,runContractLoop,contrastAudit}),null,2));
