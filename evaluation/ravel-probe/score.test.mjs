import {readFileSync} from 'node:fs';
import {scoreProbe} from './score.mjs';
function testProbe(score,key,tasks){
 let checks=0;const ok=(b,m)=>{checks++;if(!b)throw Error(m)};
 const full=key.answers.map(a=>({...a}));
 ok(tasks.cases.length===key.answers.length&&tasks.cases.every(t=>{const a=key.answers.find(a=>a.id===t.id);return a&&t.actions.includes(a.action)&&t.statuses.includes(a.status)&&!!t.numeric===Object.hasOwn(a,"value")}),"key matches available choices");
 ok(score(key,full).passed===full.length,"perfect");
 ok(score(key,[]).passed===0&&score(key,[]).submitted===0,"missing");
 ok(score(key,full.slice(1)).passed===full.length-1,"partial");
 ok(score(key,full.map(a=>({...a,status:"fabricated"}))).passed===0,"wrong status");
 ok(score(key,full.map(a=>({...a,action:"fabricated"}))).passed===0,"wrong action");
 const numeric=full.filter(a=>Object.hasOwn(a,"value")).length;
 ok(score(key,full.map(a=>({...a,value:String(a.value)}))).numericCorrect===0,"not numeric");
 ok(score(key,full.map(a=>({...a,value:a.value+1}))).passed===full.length-numeric,"wrong numbers");
 ok(score(key,[...full].reverse()).passed===full.length,"order independent");
 ok(score(key,full.map(a=>({...a,reason:""}))).passed===full.length,"reason separate");
 for(const xs of [[full[0],full[0]],[{id:"unknown"}]]){let fail=false;try{score(key,xs)}catch{fail=true}ok(fail,"reject invalid identity")}
 // every one-field error must invalidate only the affected case
 for(let i=0;i<full.length;i++){
  for(const field of ["action","status",...(Object.hasOwn(full[i],"value")?["value"]:[])]){
   const bad=full.map((a,j)=>j===i?{...a,[field]:"wrong"}:a),r=score(key,bad);
   ok(r.passed===full.length-1&&!r.rows.find(x=>x.id===full[i].id).pass,"local mutation");
  }
 }
 return {checks,cases:full.length,numeric};
}
const read=name=>JSON.parse(readFileSync(new URL(name,import.meta.url),'utf8'));
console.log(JSON.stringify(testProbe(scoreProbe,read('./answer-key.json'),read('./tasks.json')),null,2));
