import {contrastAudit} from './contrast-audit.mjs';
function testAudit(audit){
 let assertions=0;const ok=(x,m)=>{assertions++;if(!x)throw Error(m)};
 const base={target:"test",orientation:"higher",required:["a","b"],observed:{value:10,scope:"frozen"},rivals:[{id:"a",value:8,scope:"frozen"},{id:"b",value:12,scope:"frozen"}]};
 let x=audit(base);ok(x.complete&&x.sign==="reversal"&&x.action==="explain-rival-dependence","reversal");
 x=audit({...base,rivals:base.rivals.slice(0,1)});ok(!x.complete&&x.missing[0]==="b"&&x.action==="complete-comparison","missing");
 x=audit({...base,rivals:[base.rivals[0],{...base.rivals[1],scope:"different"}]});ok(!x.complete&&x.incompatible[0]==="b","scope");
 x=audit({...base,orientation:"lower"});ok(x.rows[0].delta===-2&&x.rows[1].delta===2,"orientation");
 x=audit({...base,rivals:[...base.rivals,{id:"posthoc",value:100,scope:"frozen"}]});ok(x.extra[0]==="posthoc"&&x.range[1]===2,"extras do not silently redefine roster");
 x=audit({...base,rivals:base.rivals.map(r=>({...r,value:10}))});ok(x.sign==="zero","tie");
 x=audit({...base,rivals:[{...base.rivals[0],value:10},base.rivals[1]]});ok(x.sign==="boundary","boundary");
 x=audit({...base,required:["a","b","c"]});ok(!x.complete&&x.sign==="reversal","reversal despite missing comparator");
 for(const patch of [{required:["a","a"]},{rivals:[base.rivals[0],base.rivals[0]]},{observed:{value:NaN,scope:"frozen"}},{observed:{value:1e308,scope:"frozen"},rivals:[{...base.rivals[0],value:-1e308}]}]){
  let thrown=false;try{audit({...base,...patch})}catch{thrown=true}ok(thrown,"invalid input");
 }
 let seed=20261127;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32};
 for(let t=0;t<500;t++){
  const o=Math.floor(rnd()*21)-10, vals=Array.from({length:5},()=>Math.floor(rnd()*21)-10), orientation=rnd()<.5?"higher":"lower";
  const required=vals.map((_,i)=>String(i)),rivals=vals.map((v,i)=>({id:String(i),scope:"s",value:v}));
  const z=audit({target:"generated",orientation,required,observed:{scope:"s",value:o},rivals});
  // Independent range oracle from extrema, not a duplicate per-rival loop.
  const lo=orientation==="higher"?o-Math.max(...vals):Math.min(...vals)-o;
  const hi=orientation==="higher"?o-Math.min(...vals):Math.max(...vals)-o;
  ok(z.complete&&z.range[0]===lo&&z.range[1]===hi,"range oracle");
  ok((z.sign==="reversal")===(lo<0&&hi>0),"sign oracle");
  const shuffled=audit({target:"generated",orientation,required:[...required].reverse(),observed:{scope:"s",value:o},rivals:[...rivals].reverse()});
  ok(shuffled.sign===z.sign&&shuffled.action===z.action,"permutation invariant");
 }
 return {assertions,generated:500,seed:20261127};
}
console.log(JSON.stringify(testAudit(contrastAudit),null,2));
