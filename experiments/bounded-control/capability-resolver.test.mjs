import {resolveCapabilities} from './capability-resolver.mjs';
import {planObligations} from './obligation-planner.mjs';
function testResolver(resolveCapabilities,planObligations){
 let checks=0;const ok=(b,m)=>{checks++;if(!b)throw Error(m)};
 const port=(contract,scope="task",revision="1")=>({contract,scope,revision});
 const provider=(id,offers,cost,extra={})=>({id,offers,requires:[],cost,available:true,authorized:true,equivalenceVerified:true,current:true,effect:"local-readonly",...extra});
 const seed=port("prefomal-seed"),ordered=port("preoutcome-order"),result=port("protected-seed");
 const archive=provider("archive",[seed],1),legacy=provider("napkin",[seed,ordered,result],4),check=provider("verify-seed",[ordered,result],1,{requires:[seed]});
 const x={obligations:[seed,ordered,result],providers:[archive,legacy,check],budget:4,planObligations};
 ok(resolveCapabilities(x).providers.join()==="archive,verify-seed","native and residual composition");
 ok(resolveCapabilities({...x,providers:[archive]}).status==="HOLD","archive alone insufficient");
 ok(resolveCapabilities({...x,providers:[{...archive,current:false},legacy,check]}).providers.join()==="napkin","stale replacement refused");
 ok(resolveCapabilities({...x,providers:[{...archive,equivalenceVerified:false},legacy,check]}).providers.join()==="napkin","unverified equivalence refused");
 ok(resolveCapabilities({...x,providers:[provider("wrong-scope",[port("prefomal-seed","other"),ordered,result],1),legacy]}).providers.join()==="napkin","scope mismatch");
 ok(resolveCapabilities({...x,providers:[provider("wrong-revision",[port("prefomal-seed","task","2"),ordered,result],1),legacy]}).providers.join()==="napkin","revision mismatch");
 ok(resolveCapabilities({...x,providers:[{...archive,authorized:false},check]}).status==="HOLD","permission");
 ok(resolveCapabilities({...x,budget:1}).status==="HOLD","budget");
 ok(resolveCapabilities({...x,providers:[provider("a",[seed],1,{requires:[result]}),provider("b",[result,ordered],1,{requires:[seed]})]}).status==="HOLD","cyclic self-support");
 let rng=20261127;const rnd=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/2**32};
 function oracle(obligations,providers,budget){
  const key=o=>JSON.stringify([o.contract,o.scope,o.revision]);const target=obligations.map(key);let best=Infinity;
  function visit(facts,done,cost){if(target.every(k=>facts.has(k))){best=Math.min(best,cost);return}if(cost>=best)return;
   for(const p of providers)if(!done.has(p.id)&&p.available&&p.authorized&&p.equivalenceVerified&&p.current&&p.effect==="local-readonly"&&cost+p.cost<=budget&&p.requires.every(r=>facts.has(key(r))))visit(new Set([...facts,...p.offers.map(key)]),new Set([...done,p.id]),cost+p.cost)}
  visit(new Set(),new Set(),0);return best;
 }
 let solved=0;
 for(let t=0;t<500;t++){const ports=Array.from({length:4},(_,i)=>port("f"+i));const pick=()=>ports[Math.floor(rnd()*4)];const obligations=[pick()];const providers=Array.from({length:6},(_,i)=>provider("p"+i,[pick()],1+Math.floor(rnd()*3),{requires:rnd()<.35?[pick()]:[],equivalenceVerified:rnd()>.1,current:rnd()>.1}));const budget=Math.floor(rnd()*9);const actual=resolveCapabilities({obligations,providers,budget,planObligations}),expected=oracle(obligations,providers,budget);ok((actual.cost??Infinity)===expected,"oracle "+t);if(actual.status==="PLAN")solved++}
 return {checks,generated:500,solved,seed:20261127};
}
console.log(JSON.stringify(testResolver(resolveCapabilities,planObligations),null,2));
