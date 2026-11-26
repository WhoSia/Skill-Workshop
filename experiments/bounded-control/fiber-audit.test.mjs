import {fiberAudit} from './fiber-audit.mjs';
function testFiber(audit){
 let checks=0;const ok=(x,m)=>{checks++;if(!x)throw Error(m)};
 const row=(id,observation,property)=>({id,observation,property});
 let x=audit([row("a","x","1"),row("b","x","2"),row("c","y","1")]);ok(x.status==="COUNTEREXAMPLE"&&x.witness.states[0].id==="a"&&x.witness.states[1].id==="b","witness");
 x=audit([row("a","x","1"),row("b","x","1"),row("c","y","2")]);ok(x.status==="CONSTANT_ON_ENUMERATED_FIBERS"&&x.ambiguousFibers===0,"factorization");
 x=audit([row("a","__proto__","1"),row("b","__proto__","2")]);ok(x.ambiguousFibers===1,"opaque keys");
 for(const rows of [[],[row("a","x","1"),row("a","y","2")],[row("a","", "1")],[row("a","x",1)]]){
  let fail=false;try{audit(rows)}catch{fail=true}ok(fail,"invalid input");
 }
 function oracle(rows){
  let pairs=0;const ambiguous=new Set();
  for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){pairs++;if(rows[i].observation===rows[j].observation&&rows[i].property!==rows[j].property)ambiguous.add(rows[i].observation)}
  return {pairs,ambiguous:ambiguous.size};
 }
 let seed=20261127;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32};
 let comparisons=0,pairs=0,negative=0;
 for(let t=0;t<500;t++){
  const n=1+Math.floor(rnd()*120),obs=1+Math.floor(rnd()*20);
  const rows=Array.from({length:n},(_,i)=>row(String(i),String(Math.floor(rnd()*obs)),t%2===0?"same":String(Math.floor(rnd()*3))));
  const got=audit(rows),want=oracle(rows);
  ok(got.ambiguousFibers===want.ambiguous,"ambiguity oracle");
  ok((got.witness!==null)===(want.ambiguous>0),"witness existence");
  if(got.witness){const [a,b]=got.witness.states.map(s=>rows.find(r=>r.id===s.id));ok(a.observation===b.observation&&a.property!==b.property,"witness validity");negative++}
  const reverse=audit([...rows].reverse());ok(reverse.status===got.status&&reverse.ambiguousFibers===got.ambiguousFibers,"permutation invariant");
  comparisons+=got.comparisons;pairs+=want.pairs;
 }
 const large=Array.from({length:10000},(_,i)=>row(String(i),String(i%100),String(i%100)));
 const z=audit(large);ok(z.comparisons===9900&&z.status==="CONSTANT_ON_ENUMERATED_FIBERS","large structured domain");
 return {checks,generated:500,negative,comparisons,pairs,large:{states:10000,groupComparisons:z.comparisons,pairwiseComparisons:10000*9999/2},seed:20261127};
}
console.log(JSON.stringify(testFiber(fiberAudit),null,2));
