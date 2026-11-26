import {selectRefinement} from './refinement-selector.mjs';
function testRefinement(select){
 let checks=0;const ok=(x,m)=>{checks++;if(!x)throw Error(m)};
 const c=(id,cost=1,admitted=true)=>({id,cost,admitted});
 const rows=Array.from({length:4},(_,i)=>({id:String(i),observation:"same",target:String((i>>1)^(i&1)),values:{a:String(i>>1),b:String(i&1),full:String(i),noise:"x"}}));
 const x={rows,channels:[c("a"),c("b"),c("full",3),c("noise")],budget:3};
 let z=select(x);ok(z.plan.cost===2&&z.plan.channels.join()==="a,b","complementary observations");
 ok(select({...x,budget:1}).plan===null,"budget");
 ok(select({...x,channels:[c("full",1,false),c("noise")]}).plan===null,"admission");
 ok(select({...x,rows:rows.map(r=>({...r,observation:r.target}))}).plan.cost===0,"already identified");
 ok(select({...x,channels:[c("full",1),c("a"),c("b")]}).plan.channels[0]==="full","cheaper full observation");
 for(const p of [{rows:[]},{channels:[c("a"),c("a")]},{rows:[...rows,rows[0]]},{rows:rows.map(r=>({...r,values:{}}))},{budget:-1}]){
  let threw=false;try{select({...x,...p})}catch{threw=true}ok(threw,"invalid input");
 }
 // Independent oracle: enumerate all subsets and all conflicting pairs.
 function oracle({rows,channels,budget}){
  const a=channels.filter(c=>c.admitted);let best=Infinity;
  for(let mask=0;mask<1<<a.length;mask++){
   const s=a.filter((_,i)=>mask&(1<<i)),cost=s.reduce((v,c)=>v+c.cost,0);
   if(cost>budget||cost>=best)continue;
   let valid=true;
   for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++)if(rows[i].observation===rows[j].observation&&rows[i].target!==rows[j].target&&s.every(c=>rows[i].values[c.id]===rows[j].values[c.id]))valid=false;
   if(valid)best=cost;
  }return best;
 }
 let seed=20261127;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32};
 let solved=0,already=0,visited=0;
 for(let t=0;t<600;t++){
  const channels=Array.from({length:5},(_,j)=>c("c"+j,1+Math.floor(rnd()*3),rnd()>.15));
  const rows=Array.from({length:2+Math.floor(rnd()*12)},(_,i)=>({id:String(i),observation:String(Math.floor(rnd()*3)),target:String(Math.floor(rnd()*3)),values:Object.fromEntries(channels.map(c=>[c.id,String(Math.floor(rnd()*3))]))}));
  const input={rows,channels,budget:Math.floor(rnd()*10)};
  const r=select(input),want=oracle(input);
  ok((r.plan?.cost??Infinity)===want,"oracle minimum");
  if(r.plan){solved++;if(!r.plan.cost)already++;const s=new Set(r.plan.channels);ok(oracle({...input,channels:channels.filter(c=>s.has(c.id))})===r.plan.cost,"returned plan validity")}
  ok((select({...input,rows:[...rows].reverse()}).plan?.cost??Infinity)===want,"row permutation");
  visited+=r.visited;
 }
 return {checks,generated:600,solved,already,unsolved:600-solved,visited,seed:20261127};
}
console.log(JSON.stringify(testRefinement(selectRefinement),null,2));
