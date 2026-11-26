import {planObligations,runContractLoop} from "./obligation-planner.mjs";
function testContracts(plan,run){
 const a=(id,requires=[],provides=[id],cost=1,extra={})=>({id,requires,provides,cost,available:true,authorized:true,effect:"local-readonly",...extra});
 const audit=a("audit",["input"],["audited"]);
 const base={catalog:[a("expensive",[],["input"],3),a("cheap",[],["input"]),audit],required:["audit"],budget:4,maxSteps:4};
 const ok=x=>({status:"verified",facts:x.provides});
 const cases=[
 ["min-cost prerequisite",()=>{const p=plan(base);return p.cost===2&&p.plan.join()==="cheap,audit"}],
 ["budget rejects impossible",()=>plan({...base,budget:1}).status==="HOLD"],
 ["step limit rejects impossible",()=>plan({...base,maxSteps:1}).status==="HOLD"],
 ["blocked required",()=>plan({...base,unavailable:["audit"]}).reason==="required-unavailable"],
 ["blocked prerequisite",()=>plan({...base,unavailable:["cheap","expensive"]}).status==="HOLD"],
 ["cycle cannot create its own evidence",()=>plan({catalog:[a("x",["y"]),a("y",["x"])],required:["x"],budget:3}).status==="HOLD"],
 ["shared prerequisite",()=>plan({catalog:[a("seed",[],["s"]),a("x",["s"]),a("y",["s"])],required:["x","y"],budget:3}).cost===3],
 ["permission not overridden by score",()=>plan({...base,catalog:[a("bad",[],["input"],1,{authorized:false}),audit],scores:{bad:1}}).status==="HOLD"],
 ["external effects rejected",()=>plan({...base,catalog:[a("bad",[],["input"],1,{effect:"write"}),audit]}).status==="HOLD"],
 ["state cap holds without claiming optimum",()=>plan({...base,stateLimit:1}).reason==="state-limit"],
 ["score breaks equal-cost choice",()=>plan({...base,catalog:[a("x",[],["input"]),a("y",[],["input"]),audit],scores:{x:0,y:1,audit:1}}).plan[0]==="y"],
 ["initial facts avoid redundant prerequisite",()=>plan({...base,initialFacts:["input"]}).cost===1],
 ["required action cannot be replaced by same fact",()=>plan({...base,initialFacts:["audited","input"]}).plan.join()==="audit"],
 ["replan after failed cheap prerequisite",()=>{const r=run({...base,budget:5,goal:"g",score:()=>.5,execute:x=>x.id==="cheap"?{status:"failed"}:ok(x)});return r.reason==="obligations-satisfied"&&r.receipts.map(x=>x.selected).join()==="cheap,expensive,audit"&&r.remaining===0}],
 ["contract frozen against score mutation",()=>{const r=run({...base,goal:"g",score:x=>{try{x.provides.push("fake")}catch{}return .5},execute:ok});return !r.facts.includes("fake")&&r.reason==="obligations-satisfied"}],
 ["partial evidence cannot discharge obligation",()=>run({...base,goal:"g",score:()=>.5,execute:x=>x.id==="audit"?{status:"verified",facts:[]}:ok(x)}).reason==="mandatory-failure"],
 ["invalid score holds",()=>run({...base,goal:"g",score:()=>NaN,execute:ok}).reason==="invalid-scores"],
 ["negative score does not erase necessary prerequisite",()=>run({...base,goal:"g",score:()=>0,execute:ok}).reason==="obligations-satisfied"],
 ["actual consumed budget after failure",()=>run({...base,budget:2,goal:"g",score:()=>.5,execute:()=>({status:"failed"})}).remaining===1]
 ];
 // Independent permutation oracle: no subset memo, no irrelevant-action pruning.
 function oracle(catalog,required,budget,depth,facts=new Set(),done=new Set()){
  if(required.every(x=>done.has(x)))return 0;
  if(depth===0)return Infinity;
  let best=Infinity;
  for(const x of catalog)if(!done.has(x.id)&&x.cost<=budget&&x.requires.every(f=>facts.has(f))){best=Math.min(best,x.cost+oracle(catalog,required,budget-x.cost,depth-1,new Set([...facts,...x.provides]),new Set([...done,x.id])))}
  return best;
 }
 let seed=37;const rand=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n};
 let checked=0,match=true;
 for(let i=0;i<240;i++){
   const catalog=Array.from({length:5},(_,j)=>a("a"+j,rand(3)===0?[]:["f"+rand(4)],["f"+rand(4)],1+rand(3)));
   const required=["a"+rand(5)],budget=rand(9),depth=1+rand(5);
   const actual=plan({catalog,required,budget,maxSteps:depth});
   const expected=oracle(catalog,required,budget,depth);
   match&&=(actual.status==="PLAN"?actual.cost:Infinity)===expected;checked++;
 }
 return {cases:cases.map(([name,fn])=>{try{return {name,pass:fn()===true}}catch(e){return {name,pass:false,error:String(e)}}}),oracle:{checked,match}};
}
const result=testContracts(planObligations,runContractLoop);
console.log(JSON.stringify(result,null,2));
if(!result.oracle.match||result.cases.some(x=>!x.pass))process.exitCode=1;
