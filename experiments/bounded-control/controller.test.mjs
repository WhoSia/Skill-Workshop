import {runResearchLoop} from "./controller.mjs";
function checks(run){
  const base={goal:"test",budget:4};
  const a=(id,extra={})=>({id,goal:"test",available:true,authorized:true,effect:"local-readonly",cost:1,requires:[],provides:[id],scores:{value:.9,confidence:.9,relevance:.9,burden:.1},...extra});
  const success=x=>({status:"verified",facts:x.provides});
  const cases=[
    ["prerequisite ordering",()=>run({...base,propose:()=>[a("b",{requires:["a"]}),a("a")],execute:success}).facts.join()==="a,b"],
    ["goal lock",()=>run({...base,propose:()=>[a("x",{goal:"other"})],execute:()=>{throw Error()}}).facts.length===0],
    ["permission gate",()=>run({...base,propose:()=>[a("x",{authorized:false})],execute:success}).facts.length===0],
    ["side effect gate",()=>run({...base,propose:()=>[a("x",{effect:"write"})],execute:success}).facts.length===0],
    ["budget gate",()=>run({...base,budget:0,propose:()=>[a("x")],execute:success}).remaining===0],
    ["NaN rejected",()=>run({...base,propose:()=>[a("x",{scores:{value:NaN,confidence:1,relevance:1,burden:0}})],execute:success}).facts.length===0],
    ["duplicate rejected",()=>run({...base,propose:()=>[a("x"),a("x")],execute:success}).facts.length===0],
    ["unexpected output rejected",()=>run({...base,propose:()=>[a("x")],execute:()=>({status:"verified",facts:["fake"]})}).facts.length===0],
    ["mandatory not optional",()=>run({...base,propose:()=>[a("x",{mandatory:true,requires:["missing"]}),a("y")],execute:success}).reason==="mandatory-hold"],
    ["mandatory failed",()=>run({...base,propose:()=>[a("x",{mandatory:true})],execute:()=>({status:"failed"})}).reason==="mandatory-failure"],
    ["origin review",()=>run({...base,propose:()=>[a("x"),a("y"),a("z")],execute:()=>({status:"verified",facts:[]})}).reason==="origin-review"],
    ["repair after failure",()=>run({...base,propose:s=>s.tried.includes("x")?[a("y")]:[a("x")],execute:x=>x.id==="x"?{status:"failed"}:success(x)}).facts.join()==="y"],
    ["no retry",()=>run({...base,propose:()=>[a("x")],execute:()=>({status:"failed"})}).receipts.filter(x=>x.selected).length===1],
    ["negative value",()=>run({...base,propose:()=>[a("x",{scores:{value:.1,confidence:.1,relevance:.1,burden:.9}})],execute:success}).facts.length===0],
    ["cost spent on failure",()=>run({...base,propose:()=>[a("x",{cost:3})],execute:()=>{throw Error("failure")}}).remaining===1],
    ["scope frozen",()=>run({...base,propose:s=>{try{s.goal="other"}catch{}return[a("x")]},execute:success}).goal==="test"]
  ];
  return cases.map(([name,test])=>{try{return {name,pass:test()===true}}catch(e){return {name,pass:false,error:String(e)}}});
}
const results=checks(runResearchLoop);
console.log(JSON.stringify(results,null,2));
if(results.some(x=>!x.pass))process.exitCode=1;
