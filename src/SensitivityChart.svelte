<script lang="ts">
  import { money } from './lib/model';
  let { low, base, high, lang }: {low:number;base:number;high:number;lang:'en'|'ms'} = $props();
  const minimum = $derived(Math.min(0,low,base,high));
  const maximum = $derived(Math.max(0,low,base,high));
  const extent = $derived(maximum-minimum || 1);
  const zero = $derived((-minimum/extent)*330);
  const rows = $derived([{value:low,label:lang==='en'?'25% fewer customers':'Pelanggan kurang 25%'},{value:base,label:lang==='en'?'Current estimate':'Anggaran semasa'},{value:high,label:lang==='en'?'25% more customers':'Pelanggan lebih 25%'}]);
</script>
<figure class="scenario-graph">
  <div class="scenario-graph-axis"><span>{lang==='en'?'Operating shortfall':'Kekurangan operasi'}</span><span>{lang==='en'?'Operating surplus':'Lebihan operasi'}</span></div>
  {#each rows as row,i}
    <div class="scenario-graph-row"><div><span>{row.label}</span><strong>{money(row.value)}</strong></div>
      <svg viewBox="0 0 330 28" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0" y="0" width="330" height="28" rx="3" fill="#f1f0e9"/>
        <rect x={row.value<0?(row.value-minimum)/extent*330:zero} y="4" width={Math.abs(row.value)/extent*330} height="20" rx="2" fill={row.value<0?'#a65341':i===1?'#b58a3b':'#0b3046'}/>
        <line x1={zero} y1="0" x2={zero} y2="28" stroke="#536875" stroke-width="1"/>
      </svg>
    </div>
  {/each}
  <figcaption>{lang==='en'?'The vertical line is RM 0. Only customer volume changes (±25%); all other inputs stay the same.':'Garis menegak ialah RM 0. Hanya jumlah pelanggan berubah (±25%); semua input lain kekal.'}</figcaption>
</figure>
