<script lang="ts">
  import { Minus, Plus, SlidersHorizontal, ArrowRight, Check, Store, PencilLine } from 'lucide-svelte';
  import SensitivityChart from './SensitivityChart.svelte';
  import { money } from './lib/model';
  import { calculateInputs, type ScenarioInputs } from './lib/scenario-inputs';
  import ToolIllustration from './ToolIllustration.svelte';
  let { lang, inputs = $bindable(), mode, onMode }: {
    lang: 'en' | 'ms'; inputs: ScenarioInputs; mode: 'example' | 'own'; onMode: (mode: 'example' | 'own') => void;
  } = $props();
  const t = (en: string, ms: string) => lang === 'en' ? en : ms;
  const calc = $derived(calculateInputs(inputs));
  const missing = $derived(Object.values(inputs).filter(v => v === undefined).length);
  const gap = $derived(calc ? Math.max(0, Math.ceil(calc.breakEven - (inputs.customers || 0))) : 0);
  function adjustCustomers(amount: number) { inputs.customers = Math.max(0, (inputs.customers ?? 0) + amount); }
</script>

<section class="scenario-tool" aria-labelledby="scenario-title">
  <div class="scenario-tool-heading"><div><span class="eyebrow">{t('TRY THE BUSINESS NUMBERS', 'CUBA ANGKA PERNIAGAAN')}</span><h2 id="scenario-title" tabindex="-1">{t('What would it take to break even?', 'Apa yang diperlukan untuk pulang modal?')}</h2><p>{t('Change a number. See what it means for covering your monthly operating costs.', 'Ubah satu angka. Lihat kesannya terhadap keupayaan menampung kos operasi bulanan.')}</p></div><ToolIllustration kind="business"/></div>
  <div class="scenario-mode" aria-label={t('Scenario input choice', 'Pilihan input senario')}>
    <button aria-pressed={mode==='example'} class:chosen={mode==='example'} onclick={()=>onMode('example')}><span aria-hidden="true">{#if mode==='example'}<Check size={13}/>{:else}<Store size={13}/>{/if}</span>{t('Try an example', 'Cuba contoh')}</button>
    <button aria-pressed={mode==='own'} class:chosen={mode==='own'} onclick={()=>onMode('own')}><span aria-hidden="true">{#if mode==='own'}<Check size={13}/>{:else}<PencilLine size={13}/>{/if}</span>{t('Use my numbers', 'Guna angka saya')}</button>
  </div>
  <p class="assumption-banner"><SlidersHorizontal size={18}/>{mode==='example' ? t('Illustrative inputs you can change. These are not measured sales for this location.', 'Input contoh yang boleh diubah. Ini bukan jualan yang diukur untuk lokasi ini.') : t('Enter your five estimates. Results appear when all five are valid. Your example stays available.', 'Masukkan lima anggaran anda. Hasil dipaparkan apabila semuanya sah. Contoh anda masih tersedia.')}</p>
  <div class="calculator-layout">
    <div class="calculator-inputs">
      <fieldset><legend>{t('Money coming in', 'Wang masuk')}</legend>
        <label for="daily-customers">{t('Customers per day', 'Pelanggan sehari')}</label>
        <div class="number-stepper"><button aria-label={t('10 fewer customers per day', 'Kurangkan 10 pelanggan sehari')} onclick={()=>adjustCustomers(-10)} disabled={inputs.customers===undefined || inputs.customers<=0}><Minus size={14}/>10</button><input id="daily-customers" type="number" min="0" step="1" bind:value={inputs.customers} placeholder="—"/><button aria-label={t('10 more customers per day', 'Tambah 10 pelanggan sehari')} onclick={()=>adjustCustomers(10)} disabled={inputs.customers===undefined}><Plus size={14}/>10</button></div>
        <div class="calculator-pair"><label for="average-spend">{t('Average spend (RM)', 'Belanja purata (RM)')}<input id="average-spend" type="number" min="0.01" step="0.01" bind:value={inputs.basket} placeholder="—"/></label><label for="opening-days">{t('Open days / month', 'Hari buka / bulan')}<input id="opening-days" type="number" min="1" max="31" step="1" bind:value={inputs.days} placeholder="—"/></label></div>
      </fieldset>
      <fieldset><legend>{t('Money going out', 'Wang keluar')}</legend>
        <label for="fixed-costs">{t('Monthly fixed costs (RM)', 'Kos tetap bulanan (RM)')}<input id="fixed-costs" type="number" min="0" step="1" bind:value={inputs.fixed} aria-describedby="fixed-help" placeholder="—"/></label><p id="fixed-help" class="input-help">{t('Rent, salaries, utilities and other fixed costs.', 'Sewa, gaji, utiliti dan kos tetap lain.')}</p>
        <label for="contribution">{t('Contribution margin (%)', 'Margin sumbangan (%)')}<input id="contribution" type="number" min="0.01" max="100" step="0.01" bind:value={inputs.margin} aria-describedby="margin-help" placeholder="—"/></label><p id="margin-help" class="input-help">{inputs.margin !== undefined && inputs.margin>0 && inputs.margin<=100 ? t(`Out of every RM100 in sales, RM${inputs.margin} remains after stock, ingredients and other variable costs.`, `Daripada setiap RM100 jualan, RM${inputs.margin} berbaki selepas stok, bahan dan kos berubah lain.`) : t('The share of sales left after stock, ingredients and other variable costs.', 'Bahagian jualan yang berbaki selepas stok, bahan dan kos berubah lain.')}</p>
      </fieldset>
  <div class="mobile-result-bar"><div><span>{t('To cover costs', 'Untuk menampung kos')}</span><strong>{calc ? `${calc.breakEven} ${t('customers / day','pelanggan / hari')}` : t('Enter all five estimates', 'Isi kelima-lima anggaran')}</strong>{#if calc}<small>{t('Your estimate: ', 'Anggaran anda: ')}{inputs.customers}{t(' / day', ' / hari')}</small>{/if}</div><button disabled={!calc} onclick={()=>{const result=document.getElementById('scenario-result');result?.focus({preventScroll:true});result?.scrollIntoView({behavior:'instant',block:'start'});}}>{t('See result', 'Lihat hasil')}<ArrowRight size={16}/></button></div>
    </div>
    <div class="calculator-output" id="scenario-result" tabindex="-1">
      {#if calc}
        {#key `${calc.sales}-${calc.profit}-${calc.breakEven}`}
          <div class="break-even-card result-refresh">
            <span class="micro">{t('TO COVER MONTHLY OPERATING COSTS', 'UNTUK MENAMPUNG KOS OPERASI BULANAN')}</span>
            <div class="break-even-number"><strong>{calc.breakEven}</strong><span>{t('customers', 'pelanggan')}<br/>{t('per day', 'sehari')}</span></div>
            <p>{t('That’s your break-even point with these assumptions.', 'Itulah titik pulang modal anda berdasarkan andaian ini.')}</p>
            <div class="threshold-compare"><div><span>{t('Your estimate', 'Anggaran anda')}</span><strong>{inputs.customers}{t(' / day', ' / hari')}</strong></div><ArrowRight size={18}/><div><span>{t('Break-even', 'Pulang modal')}</span><strong>{calc.breakEven}{t(' / day', ' / hari')}</strong></div></div>
            <p class="threshold-note">{gap>0 ? t(`You would need about ${gap} more customers a day to cover these costs.`, `Anda memerlukan kira-kira ${gap} lagi pelanggan sehari untuk menampung kos ini.`) : t('Your estimate covers these operating costs. Whether that customer volume is achievable still needs checking.', 'Anggaran anda menampung kos operasi ini. Keupayaan mencapai jumlah pelanggan itu masih perlu disemak.')}</p>
          </div>
          <div class="money-results result-refresh"><div><span>{t('Monthly sales', 'Jualan bulanan')}</span><strong>{money(calc.sales)}</strong><small>{t('Before costs', 'Sebelum kos')}</small></div><div><span>{calc.profit<0 ? t('Operating shortfall', 'Kekurangan operasi') : t('Operating surplus', 'Lebihan operasi')}</span><strong class:negative={calc.profit<0}>{money(calc.profit)}</strong><small>{t('After variable & fixed costs', 'Selepas kos berubah & tetap')}</small></div></div>
        {/key}
      {:else}
        <div class="calculation-empty"><ToolIllustration kind="report"/><h3>{missing ? t('Your result will appear here', 'Hasil anda akan dipaparkan di sini') : t('Check your estimates', 'Semak anggaran anda')}</h3><p>{missing ? t(`${missing} of 5 estimates still to enter. Start with your expected customers per day.`, `${missing} daripada 5 anggaran belum diisi. Mulakan dengan anggaran pelanggan sehari.`) : t('Customers and fixed costs cannot be negative. Spend must be above zero, days 1–31 and margin above 0% up to 100%.', 'Pelanggan dan kos tetap tidak boleh negatif. Belanja mesti melebihi sifar, hari 1–31 dan margin melebihi 0% hingga 100%.')}</p></div>
      {/if}
      <p class="calculation-status" role="status" aria-live="polite" aria-atomic="true">{#if calc}<Check size={15}/><span>{t('Results updated', 'Hasil dikemas kini')}<span class="visually-hidden"> · {t(`Monthly sales ${money(calc.sales)}. Operating result ${money(calc.profit)}. Break-even ${calc.breakEven} customers per day.`, `Jualan bulanan ${money(calc.sales)}. Hasil operasi ${money(calc.profit)}. Pulang modal ${calc.breakEven} pelanggan sehari.`)}</span></span>{:else}{missing ? t('Waiting for all five estimates', 'Menunggu kelima-lima anggaran') : t('Results paused until inputs are valid', 'Hasil dijeda sehingga input sah')}{/if}</p>
    </div>
  </div>
  {#if calc}<div class="sensitivity-heading"><h3>{t('What if customer numbers change?', 'Bagaimana jika jumlah pelanggan berubah?')}</h3><span>{t('Monthly operating surplus / shortfall', 'Lebihan / kekurangan operasi bulanan')}</span></div><div class="sensitivity-cards"><div><span>{t('25% fewer customers', 'Pelanggan kurang 25%')}</span><strong>{money(calc.low)}</strong></div><div class="base"><span>{t('Your current estimate', 'Anggaran semasa anda')}</span><strong>{money(calc.profit)}</strong></div><div><span>{t('25% more customers', 'Pelanggan lebih 25%')}</span><strong>{money(calc.high)}</strong></div></div>{/if}
  {#if calc}<SensitivityChart low={calc.low} base={calc.profit} high={calc.high} {lang}/>{/if}
  <p class="source-footnote">{t('Scenario only, not a forecast. Excludes tax, financing and startup costs. Changing the area does not change these assumptions.', 'Senario sahaja, bukan ramalan. Tidak termasuk cukai, pembiayaan dan kos permulaan. Menukar kawasan tidak mengubah andaian ini.')}</p>
  <details class="calculation-method"><summary>{t('How these numbers are calculated', 'Cara angka ini dikira')}</summary><p>{t('Sales = customers × average spend × opening days. Surplus = sales × contribution margin − fixed costs. Break-even = fixed costs ÷ average spend ÷ margin ÷ opening days, rounded up. The ±25% comparison changes customer volume only; it is not a confidence interval.', 'Jualan = pelanggan × belanja purata × hari buka. Lebihan = jualan × margin sumbangan − kos tetap. Pulang modal = kos tetap ÷ belanja purata ÷ margin ÷ hari buka, dibundarkan ke atas. Perbandingan ±25% mengubah jumlah pelanggan sahaja; ia bukan selang keyakinan.')}</p></details>
</section>
