/** Finite observation-fiber consistency checker. Equality is exact on caller-supplied canonical string keys; enumeration completeness is not verified. */
export function fiberAudit(rows){
 if(!Array.isArray(rows)||!rows.length)throw Error("nonempty finite domain required");
 const valid=x=>typeof x==="string"&&x.length>0,ids=new Set(),groups=new Map();
 let comparisons=0,witness=null;
 for(const r of rows){
  if(!r||!valid(r.id)||!valid(r.observation)||!valid(r.property)||ids.has(r.id))throw Error("invalid or duplicate state");
  ids.add(r.id);
  const g=groups.get(r.observation);
  if(!g){groups.set(r.observation,{first:{id:r.id,property:r.property},properties:new Set([r.property])});continue}
  comparisons++;g.properties.add(r.property);
  if(!witness&&g.first.property!==r.property)witness={observation:r.observation,states:[{...g.first},{id:r.id,property:r.property}]};
 }
 const ambiguous=[...groups.values()].filter(g=>g.properties.size>1).length;
 return {status:witness?"COUNTEREXAMPLE":"CONSTANT_ON_ENUMERATED_FIBERS",states:rows.length,fibers:groups.size,ambiguousFibers:ambiguous,comparisons,witness,authority:"EXACT_ENUMERATED_DOMAIN_ONLY"};
}
