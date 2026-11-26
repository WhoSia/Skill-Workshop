/** Instance-local reuse registry. Caller verifies semantic output and complete read-set. */
export function createReuseRegistry(index){
 const entries=new Map(),pending=new WeakMap();
 const key=p=>JSON.stringify([p.contract,p.scope,p.revision]);
 const valid=p=>p&&["contract","scope","revision"].every(k=>typeof p[k]==="string"&&p[k].trim());
 if(!index||typeof index.capture!=="function"||typeof index.isCurrent!=="function")throw Error("invalid evidence index");
 function begin(port,readSet){
  if(!valid(port))throw Error("invalid port");
  const ticket=Object.freeze({});
  pending.set(ticket,{port:Object.freeze({contract:port.contract,scope:port.scope,revision:port.revision}),certificate:index.capture(readSet)});
  return ticket;
 }
 function complete(ticket,receipt){
  const entry=pending.get(ticket);
  if(!entry)throw Error("unknown or consumed ticket");
  pending.delete(ticket);
  // Caller must establish actual verification and complete read-set; no authority granted here.
  if(receipt?.verified!==true||!valid(receipt.port)||key(receipt.port)!==key(entry.port)||!index.isCurrent(entry.certificate))return false;
  entries.set(key(entry.port),entry);return true;
 }
 function facts(){
  const result=[];
  for(const [k,e] of entries){if(index.isCurrent(e.certificate))result.push({...e.port,current:true,verified:true});else entries.delete(k)}
  return result;
 }
 function resolve(request,resolver){
  if(typeof resolver!=="function"||Object.hasOwn(request,"verifiedFacts"))throw Error("registry owns reusable facts");
  return resolver({...request,verifiedFacts:facts()});
 }
 return {begin,complete,facts,resolve};
}
