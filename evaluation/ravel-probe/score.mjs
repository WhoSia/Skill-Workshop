/** Scores only declared discrete and numeric outputs, not reasoning quality. */
export function scoreProbe(key,outputs){
 if(!Array.isArray(key?.answers)||!Array.isArray(outputs)||!key.answers.length)throw Error("invalid probe");
 const expected=new Map();
 for(const a of key.answers){
  if(typeof a.id!=="string"||!a.id||expected.has(a.id)||typeof a.action!=="string"||typeof a.status!=="string"||(Object.hasOwn(a,"value")&&!Number.isFinite(a.value)))throw Error("invalid answer key");
  expected.set(a.id,a);
 }
 const received=new Map();
 for(const o of outputs){
  if(!o||!expected.has(o.id)||received.has(o.id))throw Error("unknown or duplicate output");
  received.set(o.id,o);
 }
 const rows=[...expected.values()].map(a=>{
  const o=received.get(a.id);
  const action=o?.action===a.action,status=o?.status===a.status;
  const value=Object.hasOwn(a,"value")?typeof o?.value==="number"&&Number.isFinite(o.value)&&Math.abs(o.value-a.value)<=1e-9:null;
  return {id:a.id,present:!!o,action,status,value,pass:action&&status&&value!==false,reasonPresent:typeof o?.reason==="string"&&o.reason.trim().length>0};
 });
 return {total:rows.length,submitted:received.size,passed:rows.filter(r=>r.pass).length,actionCorrect:rows.filter(r=>r.action).length,statusCorrect:rows.filter(r=>r.status).length,numericCorrect:rows.filter(r=>r.value===true).length,numericTotal:rows.filter(r=>r.value!==null).length,rows,authority:"EXACT_PROBE_ONLY"};
}
