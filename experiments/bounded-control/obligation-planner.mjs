/** Isolated exact monotone obligation planner. Trusted catalog and callbacks, not scientific authority. */
export function planObligations({catalog,required,initialFacts=[],budget,maxSteps=8,unavailable=[],fulfilled=[],scores={},stateLimit=100000}) {
  const strings=x=>Array.isArray(x)&&x.every(v=>typeof v==="string"&&v.length>0)&&new Set(x).size===x.length;
  if(!Array.isArray(catalog)||catalog.length>20||!strings(required)||!strings(initialFacts)||!strings(unavailable)||!strings(fulfilled)||!Number.isSafeInteger(budget)||budget<0||!Number.isSafeInteger(maxSteps)||maxSteps<0||!Number.isSafeInteger(stateLimit)||stateLimit<1)throw Error("invalid planning inputs");
  const ids=new Set();
  for(const a of catalog){if(!a||typeof a.id!=="string"||!a.id||ids.has(a.id)||!strings(a.requires)||!strings(a.provides)||!Number.isSafeInteger(a.cost)||a.cost<1||a.cost>Number.MAX_SAFE_INTEGER/20)throw Error("invalid action contract");ids.add(a.id)}
  if([...required,...fulfilled,...unavailable].some(x=>!ids.has(x)))throw Error("unknown action");
  const blocked=new Set([...unavailable,...fulfilled]);
  const todo=required.filter(x=>!fulfilled.includes(x));
  const actions=catalog.filter(a=>a.available===true&&a.authorized===true&&a.effect==="local-readonly"&&!blocked.has(a.id)).map(a=>({id:a.id,cost:a.cost,requires:[...a.requires],provides:[...a.provides]}));
  for(const a of actions){const s=Object.hasOwn(scores,a.id)?scores[a.id]:0.5;if(!Number.isFinite(s)||s<0||s>1)throw Error("invalid score");a.score=s}
  actions.sort((a,b)=>b.score-a.score||(a.id<b.id?-1:a.id>b.id?1:0));
  if(todo.some(id=>!actions.some(a=>a.id===id)))return {status:"HOLD",reason:"required-unavailable",plan:[],visited:0};
  // Positive-cost monotone actions outside the backward prerequisite cone cannot improve an optimum.
  // Keep every admitted alternative producer; do not prune by score or by one selected explanation.
  const relevant=new Set(todo), needed=new Set(), known=new Set(initialFacts);
  for(const a of actions)if(relevant.has(a.id))for(const x of a.requires)if(!known.has(x))needed.add(x);
  let changed=true;
  while(changed){
    changed=false;
    for(const a of actions)if(!relevant.has(a.id)&&a.provides.some(x=>needed.has(x))){
      relevant.add(a.id);changed=true;
      for(const x of a.requires)if(!known.has(x))needed.add(x);
    }
  }
  const candidates=actions.filter(a=>relevant.has(a.id));
  const target=candidates.reduce((m,a,i)=>todo.includes(a.id)?m|(1<<i):m,0);
  const memo=new Map();let visited=0,limited=false;
  function solve(mask,facts,cost,steps){
    if((mask&target)===target)return {cost:0,plan:[]};
    if(steps>=maxSteps)return null;
    if(memo.has(mask))return memo.get(mask);
    if(++visited>stateLimit){limited=true;return null}
    let best=null;
    for(let i=0;i<candidates.length;i++){
      const a=candidates[i],bit=1<<i;
      if((mask&bit)||cost+a.cost>budget||!a.requires.every(x=>facts.has(x)))continue;
      // A non-obligation with no new facts is useless in this monotone model.
      if(!(target&bit)&&a.provides.every(x=>facts.has(x)))continue;
      const next=new Set([...facts,...a.provides]),tail=solve(mask|bit,next,cost+a.cost,steps+1);
      if(tail&&(!best||a.cost+tail.cost<best.cost))best={cost:a.cost+tail.cost,plan:[a.id,...tail.plan]};
      if(limited)return null;
    }
    memo.set(mask,best);return best;
  }
  const best=solve(0,new Set(initialFacts),0,0);
  if(limited)return {status:"HOLD",reason:"state-limit",plan:[],visited};
  return best?{status:"PLAN",...best,visited}:{status:"HOLD",reason:"no-feasible-plan",plan:[],visited};
}

export function runContractLoop({goal,catalog,required,budget,maxSteps=8,initialFacts=[],score,execute,stateLimit=100000}) {
  if(typeof goal!=="string"||!goal.trim()||!Array.isArray(catalog)||typeof score!=="function"||typeof execute!=="function")throw Error("invalid loop");
  // Owner-provided contracts are immutable snapshots. Scoring cannot rewrite them.
  const contracts=Object.freeze(catalog.map(a=>Object.freeze({...a,requires:Object.freeze([...a.requires]),provides:Object.freeze([...a.provides])})));
  const obligations=Object.freeze([...required]),facts=new Set(initialFacts),attempted=new Set(),fulfilled=new Set(),receipts=[];
  let remaining=budget,reason="step-limit";
  // Validate even when maxSteps is zero or obligations are empty.
  planObligations({catalog:contracts,required:obligations,initialFacts:[...facts],budget,maxSteps,stateLimit});
  for(let step=0;step<maxSteps;step++){
    if(obligations.every(x=>fulfilled.has(x))){reason="obligations-satisfied";break}
    const state=Object.freeze({goal,remaining,facts:Object.freeze([...facts]),pending:Object.freeze(obligations.filter(x=>!fulfilled.has(x))),attempted:Object.freeze([...attempted])});
    let scores;
    try{scores=Object.fromEntries(contracts.filter(a=>!attempted.has(a.id)).map(a=>[a.id,score(a,state)]));if(Object.values(scores).some(s=>!Number.isFinite(s)||s<0||s>1))throw Error("score")}catch{reason="invalid-scores";break}
    const p=planObligations({catalog:contracts,required:obligations,initialFacts:[...facts],budget:remaining,maxSteps:maxSteps-step,unavailable:[...attempted].filter(x=>!fulfilled.has(x)),fulfilled:[...fulfilled],scores,stateLimit});
    if(p.status!=="PLAN"||!p.plan.length){reason=p.reason??"no-plan";receipts.push({step,scores,planning:p,selected:null});break}
    const a=contracts.find(x=>x.id===p.plan[0]);
    attempted.add(a.id);remaining-=a.cost;
    let out;try{out=execute(a,state)}catch{out={status:"failed"}}
    const verified=out?.status==="verified"&&Array.isArray(out.facts)&&out.facts.every(x=>a.provides.includes(x))&&a.provides.every(x=>out.facts.includes(x));
    if(verified){for(const f of a.provides)facts.add(f);fulfilled.add(a.id)}
    receipts.push({step,scores,planning:p,selected:a.id,verified,remaining});
    if(!verified&&obligations.includes(a.id)){reason="mandatory-failure";break}
  }
  if(obligations.every(x=>fulfilled.has(x)))reason="obligations-satisfied";
  return {goal,reason,remaining,facts:[...facts],pending:obligations.filter(x=>!fulfilled.has(x)),receipts,authority:"DECLARED_CONTRACT_ONLY"};
}
