<script lang="ts">
  import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Store, TrainFront, MapPin } from 'lucide-svelte';
  import { counts, category, type Area } from './lib/model';
  import { calculateInputs, type ScenarioInputs } from './lib/scenario-inputs';
  import Scenario from './Scenario.svelte';
  import ReportEvidence from './ReportEvidence.svelte';
  import ToolIllustration from './ToolIllustration.svelte';
  let { lang, areas, selected = $bindable(), inputs = $bindable(), mode, onMode, onDownload, onRequest, onConsultation }: {
    lang: 'en' | 'ms'; areas: Area[]; selected: string; inputs: ScenarioInputs; mode: 'example'|'own';
    onMode: (mode:'example'|'own') => void; onDownload: () => void; onRequest: () => void; onConsultation: () => void;
  } = $props();
  const t = (en: string, ms: string) => lang === 'en' ? en : ms;
  const area = $derived(areas.find(a => a.id===selected) || areas[0]);
  const metrics = $derived(counts(area));
  const valid = $derived(!!calculateInputs(inputs));
</script>

<section class="shell tool-page report-tool-page">
  <a class="back-link" href="#explore"><ArrowLeft size={16}/>{t('Back to the map', 'Kembali ke peta')}</a>
  <div class="tool-heading"><div><span class="eyebrow">{t('SAMPLE LOCATION REPORT', 'LAPORAN LOKASI CONTOH')}</span><h1>{area.name}<br/><em>{t('Location report.', 'Laporan lokasi.')}</em></h1><p>{t('The business mix, the evidence and the questions to answer before you choose your location.', 'Campuran perniagaan, bukti dan soalan yang perlu dijawab sebelum memilih lokasi anda.')}</p></div><ToolIllustration kind="report"/></div>
  <div class="report-context"><label>{t('You’re exploring', 'Anda sedang meneroka')}<select bind:value={selected}>{#each areas as a}<option value={a.id}>{a.name} · {a.city}</option>{/each}</select></label><div><span class="source-chip">{t('Real location snapshot', 'Snapshot lokasi sebenar')}</span><small>OpenStreetMap · {area.fetchedAt.slice(0,10)} · 800 m</small></div><button class="btn outline" onclick={()=>{const heading=document.getElementById('scenario-title');heading?.focus({preventScroll:true});heading?.scrollIntoView({behavior:'instant',block:'start'});}}>{t('Try the calculator', 'Cuba kalkulator')}<ArrowRight size={17}/></button></div>
  <ReportEvidence {area} {lang}/>
  <div class="report-observations">
    <div><Store size={21}/><p><strong>{metrics.food} F&B · {metrics.retail} {t('retail', 'runcit')}</strong><span>{t('Businesses to investigate nearby', 'Perniagaan berdekatan untuk dikaji')}</span></p></div>
    <div><TrainFront size={21}/><p><strong>{metrics.transport} {t('transit', 'transit')} · {metrics.parking} {t('parking', 'parkir')}</strong><span>{t('Mapped features; check access on site', 'Ciri dipetakan; semak akses di tapak')}</span></p></div>
    <div><MapPin size={21}/><p><strong>{t('Demand is still unknown', 'Permintaan masih belum diketahui')}</strong><span>{t('Counts do not measure customers or sales', 'Kiraan tidak mengukur pelanggan atau jualan')}</span></p></div>
  </div>
  <details class="source-places"><summary>{t('Inspect mapped places and source links', 'Lihat tempat dipetakan dan pautan sumber')} ({area.elements.length})</summary><p>{t('An incomplete snapshot, not a business census. Features may be duplicated or outdated. Parking features are not parking spaces.', 'Snapshot tidak lengkap, bukan bancian perniagaan. Ciri mungkin bertindih atau lapuk. Ciri parkir bukan petak parkir.')}</p><div class="places-list">{#each area.elements as p}<a href={'https://www.openstreetmap.org/'+p.type+'/'+p.id} target="_blank" rel="noreferrer"><span>{p.tags.name||p.tags.shop||p.tags.amenity||p.tags.railway}</span><small>{category(p)==='food'?'F&B':category(p)==='retail'?t('Retail','Runcit'):category(p)==='parking'?t('Parking','Parkir'):t('Transport','Pengangkutan')}</small><ArrowUpRight size={13}/></a>{/each}</div></details>
  <Scenario {lang} bind:inputs {mode} {onMode}/>
  <div class="report-download"><div><h3>{t('Take the report with you', 'Bawa laporan ini bersama anda')}</h3><p>{t('PDF includes', 'PDF merangkumi')} {area.name}{t('’s charts, key findings, sources and your current scenario in a branded two-page report.', ', carta, dapatan utama, sumber dan senario semasa anda dalam laporan berjenama dua halaman.')}</p>{#if !valid}<small>{t('Complete valid estimates above, or switch to the example to enable the PDF.', 'Lengkapkan anggaran sah di atas, atau tukar kepada contoh untuk mengaktifkan PDF.')}</small>{/if}</div><button class="btn outline" onclick={onDownload} disabled={!valid}><Download size={18}/>{t('Download sample PDF', 'Muat turun PDF contoh')}</button></div>
  <div class="tool-next"><ToolIllustration kind="conversation"/><div><span class="eyebrow">{t('MAKE IT RELEVANT TO YOUR BUSINESS', 'SESUAIKAN DENGAN PERNIAGAAN ANDA')}</span><h2>{t('From an example to your own decision.', 'Daripada contoh kepada keputusan anda.')}</h2><p>{t('A custom report brings your business profile and chosen site together. We agree the scope and provisional fees with you first.', 'Laporan tersuai menggabungkan profil perniagaan dan tapak pilihan anda. Kami mempersetujui skop dan yuran sementara bersama anda dahulu.')}</p><a class="btn navy" href="#custom" onclick={(e)=>{e.preventDefault();onRequest();}}>{t('Request my custom report', 'Minta laporan tersuai saya')}<ArrowRight size={18}/></a><button class="next-secondary" onclick={onConsultation}>{t('Talk through these results first', 'Bincangkan hasil ini dahulu')}<ArrowUpRight size={16}/></button></div></div>
</section>
