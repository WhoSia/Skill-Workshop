/** Experimental bounded controller. Trusted synchronous callbacks; not a security sandbox or scientific verifier. */
export function runResearchLoop({goal,budget,maxSteps=8,propose,execute,initialFacts=[],requiredActions=[]}) {
  if(typeof goal!=="string"||!goal.trim()||!Number.isSafeInteger(budget)||budget<0||!Number.isSafeInteger(maxSteps)||maxSteps<1) throw Error("invalid run limits");
  if(!Array.isArray(initialFacts)||initialFacts.some(x=>typeof x!=="string"||!x)) throw Error("invalid initial facts");
  if(!Array.isArray(requiredActions)||requiredActions.some(x=>typeof x!=="string"||!x)) throw Error("invalid mandatory obligations");
  const facts=new Set(initialFacts), tried=new Set(), receipts=[], obligations=new Set(requiredActions), fulfilled=new Set();
  let remaining=budget, idle=0, reason="step-limit";
  const snapshot=()=>Object.freeze({goal,remaining,facts:Object.freeze([...facts]),tried:Object.freeze([...tried]),idle,pending:Object.freeze([...obligations].filter(x=>!fulfilled.has(x)))});
  const unit=x=>typeof x==="number"&&Number.isFinite(x)&&x>=0&&x<=1;
  for(let step=0;step<maxSteps;step++){
    if(idle>=2){reason="origin-review";break}
    const candidates=propose(snapshot());
    if(!Array.isArray(candidates)){reason="invalid-proposals";break}
    for(const a of candidates)if(a?.mandatory===true&&typeof a.id==="string"&&a.id)obligations.add(a.id);
    const ids=new Map();for(const a of candidates)if(a&&typeof a.id==="string")ids.set(a.id,(ids.get(a.id)||0)+1);
    const rows=candidates.map(a=>{
      let blocked=null;
      const scores=a?.scores;
      const valid=!!scores&&["value","confidence","relevance","burden"].every(k=>unit(scores[k]));
      if(!a||typeof a.id!=="string"||!a.id||ids.get(a.id)!==1)blocked="invalid-id";
      else if(!valid||!Number.isSafeInteger(a.cost)||a.cost<1||!Array.isArray(a.requires)||!Array.isArray(a.provides)||[...a.requires,...a.provides].some(x=>typeof x!=="string"||!x))blocked="invalid-contract";
      else if(a.goal!==goal)blocked="goal-mismatch";
      else if(a.available!==true||a.authorized!==true||a.effect!=="local-readonly")blocked="admission";
      else if(tried.has(a.id))blocked="already-attempted";
      else if(!a.requires.every(x=>facts.has(x)))blocked="missing-prerequisite";
      else if(a.cost>remaining)blocked="budget";
      const score=valid?(scores.value*scores.confidence*scores.relevance-scores.burden+1)/2:null;
      return {id:a?.id??null,score,blocked,mandatory:obligations.has(a?.id)&&!fulfilled.has(a?.id),cost:a?.cost??null};
    });
    const pending=[...obligations].filter(x=>!fulfilled.has(x));
    const required=pending;
    const ready=rows.filter(x=>!x.blocked&&(required.length===0||x.mandatory)).sort((a,b)=>b.score-a.score||a.cost-b.cost||(a.id<b.id?-1:a.id>b.id?1:0));
    const chosen=ready[0];
    if(!chosen||(!chosen.mandatory&&chosen.score<=0.5)){
      reason=required.length?"mandatory-hold":rows.some(x=>x.blocked==="budget")?"budget":"no-positive-admissible-action";
      receipts.push({step,rows,selected:null,reason});break;
    }
    // Copy the declared output contract before handing control to the executor.
    const a=candidates.find(x=>x.id===chosen.id);
    const allowed=new Set(a.provides);
    const action=Object.freeze({...a,requires:Object.freeze([...a.requires]),provides:Object.freeze([...a.provides]),scores:Object.freeze({...a.scores})});
    remaining-=chosen.cost;tried.add(chosen.id);
    let result;
    try{result=execute(action,snapshot())}catch{result={status:"failed"}}
    const verified=result?.status==="verified"&&Array.isArray(result.facts)&&result.facts.every(x=>allowed.has(x))&&(!chosen.mandatory||[...allowed].every(x=>result.facts.includes(x)));
    if(verified&&chosen.mandatory)fulfilled.add(chosen.id);
    const added=verified?[...new Set(result.facts)].filter(x=>!facts.has(x)):[];
    for(const fact of added)facts.add(fact);
    idle=added.length?0:idle+1;
    receipts.push({step,rows,selected:chosen.id,outcome:verified?"verified":result?.status==="failed"?"failed":"unverified",added,remaining});
    if(chosen.mandatory&&!verified){reason="mandatory-failure";break}
    if(remaining===0){reason="budget";break}
  }
  return {goal,remaining,facts:[...facts],receipts,reason,pending:[...obligations].filter(x=>!fulfilled.has(x))};
}
