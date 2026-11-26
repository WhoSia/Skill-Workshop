/** Experimental descriptive contrast audit. Caller declares frozen comparator roster, comparable scope and observations; no inference or independent evidence verification. */
export function contrastAudit({target,orientation,required,observed,rivals}){
  const str=v=>typeof v==="string"&&v.trim().length>0;
  const num=v=>typeof v==="number"&&Number.isFinite(v);
  if(!str(target)||!["higher","lower"].includes(orientation)||!Array.isArray(required)||!required.length||!required.every(str)||new Set(required).size!==required.length||!observed||!num(observed.value)||!str(observed.scope)||!Array.isArray(rivals))throw Error("invalid contrast model");
  const byId=new Map();
  for(const r of rivals){if(!r||!str(r.id)||!num(r.value)||!str(r.scope)||byId.has(r.id))throw Error("invalid or duplicate rival");byId.set(r.id,r)}
  const missing=[],incompatible=[],rows=[],extra=[];
  for(const id of required){const r=byId.get(id);if(!r){missing.push(id);continue}if(r.scope!==observed.scope){incompatible.push(id);continue}
    const delta=orientation==="higher"?observed.value-r.value:r.value-observed.value;
    if(!num(delta))throw Error("nonfinite contrast");
    rows.push({id,delta,sign:Math.sign(delta)});
  }
  for(const id of byId.keys())if(!required.includes(id))extra.push(id);
  const range=rows.length?[Math.min(...rows.map(x=>x.delta)),Math.max(...rows.map(x=>x.delta))]:null;
  const complete=missing.length===0&&incompatible.length===0;
  const reversal=!!range&&range[0]<0&&range[1]>0;
  const sign=!range?"unobserved":reversal?"reversal":range[0]>0?"positive":range[1]<0?"negative":range[0]===0&&range[1]===0?"zero":"boundary";
  // A reversal is witnessed even in an incomplete comparison; missingness still blocks full coverage.
  const action=!complete?"complete-comparison":reversal?"explain-rival-dependence":sign==="boundary"||sign==="zero"?"retain-tie-or-boundary":"report-scoped-contrast";
  return {target,complete,missing,incompatible,extra,rows,range,sign,action,authority:"DECLARED_COMPARATOR_DESCRIPTIVE_ONLY"};
}
