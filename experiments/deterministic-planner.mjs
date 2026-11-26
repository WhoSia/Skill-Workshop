// Exact finite deterministic experiment planning under a cost and depth budget.
// World signatures may encode shared nuisance variables; no independence of marginal probes is assumed.
export function planDeterministic({worlds, probes, budget, depth=budget}) {
  if (!Array.isArray(worlds) || !worlds.length || worlds.length>64 || !Array.isArray(probes) || probes.length>24 || !Number.isSafeInteger(budget) || budget<0 || !Number.isSafeInteger(depth) || depth<0 || depth>8) throw new TypeError('invalid bounded design');
  if (worlds.some(w=>typeof w.target!=='string'||!Number.isFinite(w.weight)||w.weight<=0)) throw new TypeError('invalid world');
  if (new Set(probes.map(p=>p.id)).size!==probes.length || probes.some(p=>typeof p.id!=='string'||!p.id||!Number.isSafeInteger(p.cost)||p.cost<1||!Array.isArray(p.signature)||p.signature.length!==worlds.length||p.signature.some(x=>typeof x!=='string'))) throw new TypeError('invalid probe');
  const total=worlds.reduce((s,w)=>s+w.weight,0);
  if(!Number.isFinite(total)) throw new TypeError('invalid mass');
  const weights=worlds.map(w=>w.weight/total);
  const bits=worlds.map((_,i)=>1n<<BigInt(i));
  const full=bits.reduce((a,b)=>a|b,0n);
  const partition=probes.map(p=>{const m=new Map();p.signature.forEach((s,i)=>m.set(s,(m.get(s)??0n)|bits[i]));return {...p,masks:[...m.values()]};});
  const memo=new Map(), terminalMemo=new Map(); let visits=0,hits=0;
  function terminal(mask){
    if(terminalMemo.has(mask))return terminalMemo.get(mask);
    const by=new Map();let mass=0;
    worlds.forEach((w,i)=>{if(mask&bits[i]){const v=weights[i];mass+=v;by.set(w.target,(by.get(w.target)??0)+v);}});
    const out={mass,best:Math.max(...by.values())};terminalMemo.set(mask,out);return out;
  }
  function solve(mask,b,d){
    const key=mask.toString(16)+':'+b+':'+d;
    if(memo.has(key)){hits++;return memo.get(key);}
    visits++;
    if(visits>250000) throw new RangeError('state budget exceeded');
    const {mass,best}=terminal(mask);let ans={value:best,action:null};
    if(d>0&&b>0&&best<mass-1e-14){
      for(const p of partition){
        if(p.cost>b)continue;
        const children=p.masks.map(x=>x&mask).filter(Boolean);
        if(children.length<2)continue; // deterministic previously observed probes are constant
        const value=children.reduce((s,c)=>s+solve(c,b-p.cost,d-1).value,0);
        if(value>ans.value+1e-14)ans={value,action:p.id};
        if(ans.value>=mass-1e-14)break;
      }
    }
    memo.set(key,ans);return ans;
  }
  const answer=solve(full,budget,depth);
  return {...answer,visits,hits,authority:'FINITE_MODEL_CONDITIONAL_ONLY'};
}
