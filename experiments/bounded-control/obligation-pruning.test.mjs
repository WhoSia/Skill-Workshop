import {planObligations} from './obligation-planner.mjs';
function regression(plan,reference){
  let checks=0;const ok=(x,m)=>{checks++;if(!x)throw Error(m)};
  const a=(id,requires=[],provides=[id],cost=1,extra={})=>({id,requires,provides,cost,available:true,authorized:true,effect:"local-readonly",...extra});
  const clutter=n=>Array.from({length:n},(_,i)=>a("noise"+i,[],["irrelevant"+i]));
  const core=[a("seed",[],["s"]),a("middle",["s"],["m"]),a("audit",["m"],["pass"])];
  const heavy={catalog:[...core,...clutter(17)],required:["audit"],budget:7,maxSteps:7};
  const h=plan(heavy);ok(h.status==="PLAN"&&h.cost===3&&h.plan.join()==="seed,middle,audit","distractor plan");
  const cap=plan({...heavy,stateLimit:8});ok(cap.status==="PLAN","cap resilience");
  const small={...heavy,catalog:[...core,...clutter(9)]};
  const baseline=reference?reference(small):null, improved=plan(small);
  if(baseline)ok(baseline.cost===improved.cost&&improved.visited<baseline.visited,"search state reduction");
  const alt={catalog:[a("seed",[],["s"],3),a("alt",[],["t"]),a("via",["t"],["s"]),a("audit",["s"])],required:["audit"],budget:4};
  ok(plan(alt).plan.join()==="alt,via,audit","all alternate producers retained");
  ok(plan({...alt,initialFacts:["s"]}).cost===1,"initial facts short circuit");
  ok(plan({...alt,unavailable:["alt"]}).cost===4,"failure replan");
  ok(plan({catalog:[a("x",["y"],["x"]),a("y",["x"],["y"])],required:["x"],budget:4}).status==="HOLD","no cyclic self-support");
  // Independent oracle enumerates permutations; ignores neither irrelevant nor redundant actions.
  function oracle(c,required,available,left,depth,facts=new Set(),done=new Set()){
    if(required.every(x=>done.has(x)))return 0;if(!depth)return Infinity;
    let best=Infinity;
    for(const x of c)if(available.has(x.id)&&!done.has(x.id)&&x.cost<=left&&x.requires.every(v=>facts.has(v))){
      best=Math.min(best,x.cost+oracle(c,required,available,left-x.cost,depth-1,new Set([...facts,...x.provides]),new Set([...done,x.id])));
    }return best;
  }
  let seed=20261127;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32};
  let oldStates=0,newStates=0,oldHolds=0,newHolds=0;
  for(let i=0;i<600;i++){
    const catalog=Array.from({length:6},(_,j)=>a("a"+j,rnd()<.4?[]:["f"+Math.floor(rnd()*4)],["f"+Math.floor(rnd()*4)],1+Math.floor(rnd()*3),{authorized:rnd()>.1}));
    const required=[...new Set(["a"+Math.floor(rnd()*6),"a"+Math.floor(rnd()*6)])],initialFacts=rnd()<.4?["f0"]:[],budget=Math.floor(rnd()*12),maxSteps=Math.floor(rnd()*7);
    const x={catalog,required,initialFacts,budget,maxSteps};
    const got=plan(x),want=oracle(catalog,required,new Set(catalog.filter(z=>z.authorized).map(z=>z.id)),budget,maxSteps,new Set(initialFacts));
    ok((got.status==="PLAN"?got.cost:Infinity)===want,"oracle case "+i);
    if(reference){const b=reference(x);ok(got.status===b.status&&got.cost===b.cost,"prior equivalence");oldStates+=b.visited;newStates+=got.visited;if(b.status==="HOLD")oldHolds++;if(got.status==="HOLD")newHolds++}
  }
  return {checks,generated:600,heavy:{after:h.visited},distractors:{before:baseline?.visited??null,after:improved.visited},random:{oldStates,newStates,oldHolds,newHolds},seed:20261127};
}
console.log(JSON.stringify(regression(planObligations),null,2));
