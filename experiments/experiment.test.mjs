import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runResearch,informationGain} from './experiment.mjs';
const probe=(id,cost,values)=>({id,cost,outcomes:['0','1'],likelihood:values.map(v=>v?[0,1]:[1,0])});
// Rival graph distance signatures: v0-v1-v2-v3 path, four candidate vertices.
// Sensor probes are distance parity or threshold observations; no outcome is fed to selection.
const spec={goal:'Identify the unknown vertex of a four-vertex path',rivals:['v0','v1','v2','v3'],budget:2,experiments:[probe('constant',1,[0,0,0,0]),probe('left-half',1,[1,1,0,0]),probe('parity',1,[0,1,0,1])]};
const observe=world=>async e=>String(e.likelihood[world][1]);
test('information policy identifies each of four vertices under the same budget',async()=>{
  let adaptive=0,fixed=0;
  for(let w=0;w<4;w++){
    const a=await runResearch(spec,observe(w));const b=await runResearch(spec,observe(w),{policy:'fixed'});
    assert.equal(a.posterior[w],1);assert.equal(a.trace.length,2);assert.equal(a.authority,'MODEL_CONDITIONAL_ONLY');
    adaptive+=Number(a.status==='MODEL_CONDITIONAL_THRESHOLD');fixed+=Number(b.status==='MODEL_CONDITIONAL_THRESHOLD');
  }
  assert.deepEqual([adaptive,fixed],[4,0]);
});
test('constant and balanced probe information',()=>{assert.equal(informationGain([.25,.25,.25,.25],spec.experiments[0]),0);assert.equal(informationGain([.25,.25,.25,.25],spec.experiments[1]),1);});
test('out of model observation holds, charges attempted cost',async()=>{const r=await runResearch(spec,async()=> 'unexpected');assert.equal(r.status,'HOLD');assert.equal(r.remaining,1);assert.equal(r.trace[0].status,'OUT_OF_MODEL');assert.deepEqual(r.posterior,[.25,.25,.25,.25]);});
test('failed execution holds',async()=>{const r=await runResearch(spec,async()=>{throw Error('offline')});assert.equal(r.status,'HOLD');assert.equal(r.trace[0].status,'EXECUTION_FAILED');});
test('budget zero and uninformative design stop without calls',async()=>{let calls=0;const o=async()=>{calls++;return '0'};assert.equal((await runResearch({...spec,budget:0},o)).trace.length,0);assert.equal((await runResearch({...spec,experiments:[spec.experiments[0]]},o)).status,'NO_DISCRIMINATING_EXPERIMENT');assert.equal(calls,0);});
test('invalid likelihood rejects before execution',async()=>{await assert.rejects(runResearch({...spec,experiments:[{...spec.experiments[0],likelihood:[[2,0],[1,0],[1,0],[1,0]]}]},observe(0)),TypeError);});
test('observer mutation cannot change frozen design',async()=>{const r=await runResearch(spec,async e=>{e.outcomes[0]='changed';return '0'});assert.equal(r.status,'MODEL_CONDITIONAL_THRESHOLD');assert.equal(r.posterior[2],1);});
test('lookahead detects two individually uninformative but jointly identifying probes',async()=>{
  const xor={goal:'Identify XOR of two latent bits',rivals:['00','01','10','11'],targets:['even','odd','odd','even'],budget:2,experiments:[probe('bit-a',1,[0,0,1,1]),probe('bit-b',1,[0,1,0,1])]};
  for(let w=0;w<4;w++){
    assert.equal((await runResearch(xor,observe(w))).status,'NO_DISCRIMINATING_EXPERIMENT');
    const a=await runResearch(xor,observe(w),{policy:'lookahead'});
    assert.equal(a.status,'MODEL_CONDITIONAL_THRESHOLD');assert.equal(a.posterior[w],1);assert.equal(a.remaining,0);
  }
});
