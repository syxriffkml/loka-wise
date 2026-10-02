<script lang="ts">
  import { ArrowUpRight, Check, MapPin, Search, Store, TrainFront, Car, Utensils, ArrowRight } from 'lucide-svelte';
  import Map from './lib/Map.svelte';
  import { counts, type Area } from './lib/model';
  import ToolIllustration from './ToolIllustration.svelte';
  let { lang, areas, selected = $bindable(), filter = $bindable(), query = $bindable(), loading, loadError, onReport, onRequest }: {
    lang: 'en' | 'ms'; areas: Area[]; selected: string; filter: string; query: string;
    loading: boolean; loadError: string; onReport: () => void; onRequest: () => void;
  } = $props();
  const t = (en: string, ms: string) => lang === 'en' ? en : ms;
  const area = $derived(areas.find(a => a.id === selected) || areas[0]);
  const metrics = $derived(area ? counts(area) : null);
  const filtered = $derived(areas.filter(a => `${a.name} ${a.city}`.toLowerCase().includes(query.toLowerCase())));
  const categories = $derived([
    { id: 'all', label: t('All places', 'Semua tempat'), n: area?.elements.length || 0, icon: MapPin },
    { id: 'food', label: 'F&B', n: metrics?.food || 0, icon: Utensils },
    { id: 'retail', label: t('Retail', 'Runcit'), n: metrics?.retail || 0, icon: Store },
    { id: 'transport', label: t('Transport', 'Pengangkutan'), n: metrics?.transport || 0, icon: TrainFront },
    { id: 'parking', label: t('Parking', 'Parkir'), n: metrics?.parking || 0, icon: Car }
  ]);
  const activeCategory = $derived(categories.find(c => c.id === filter) || categories[0]);
</script>

<section class="shell tool-page">
  <div class="tool-heading">
    <div><span class="eyebrow">{t('EXPLORE A LOCATION', 'TEROKAI LOKASI')}</span>
      <h1>{t('What’s around', 'Apa yang ada')}<br/><em>{t('your next business?', 'di sekitar perniagaan anda?')}</em></h1>
      <p>{t('Choose an area. See the surrounding businesses and access points.', 'Pilih kawasan. Lihat perniagaan dan kemudahan akses di sekitarnya.')}</p>
    </div><ToolIllustration kind="map"/>
  </div>
  <div class="explore-workbench">
    <aside class="area-picker">
      <div class="tool-section-heading"><span class="step-disc">1</span><h2>{t('Location explorer', 'Peneroka lokasi')}</h2></div>
      <p>{t('Try one of our two sample areas.', 'Cuba salah satu daripada dua kawasan contoh.')}</p>
      <label class="search-field"><Search size={18}/><input bind:value={query} placeholder={t('Search SS15, TTDI…', 'Cari SS15, TTDI…')} aria-label={t('Search locations', 'Cari lokasi')}/></label>
      {#if loading}<p role="status">{t('Loading locations…', 'Memuatkan lokasi…')}</p>
      {:else if loadError}<p role="alert">{loadError}</p>
      {:else if !filtered.length}<p class="empty-search">{t('No matching area. These are our two sample snapshots.', 'Tiada kawasan sepadan. Ini dua snapshot contoh kami.')}</p><button class="text-link" onclick={()=>query=''}>{t('Show sample areas', 'Tunjukkan kawasan contoh')}</button>{/if}
      <div class="area-options">{#each filtered as a}
        <button class="location-option" class:selected={area?.id === a.id} aria-pressed={area?.id === a.id} onclick={()=>selected=a.id}>
          <MapPin size={23}/><span><strong>{a.name}</strong><small>{a.city}</small></span>
          {#if area?.id === a.id}<Check size={18}/>{:else}<ArrowRight size={18}/>{/if}
        </button>
      {/each}</div>
      <div class="other-location"><span>{t('Your location isn’t listed?', 'Lokasi anda tiada dalam senarai?')}</span><a href="#custom">{t('Request another location', 'Minta lokasi lain')}<ArrowUpRight size={16}/></a></div>
    </aside>
    <div class="map-workbench">
      <div class="tool-section-heading"><span class="step-disc">2</span><div><h2>{t('See what’s nearby', 'Lihat apa yang berdekatan')}</h2><p>{t('Tap a pin for place details. Zoom in to separate nearby pins.', 'Tekan pin untuk butiran tempat. Zum masuk untuk memisahkan pin berdekatan.')}</p></div></div>
      <div class="category-picker" aria-label={t('Show on map', 'Paparkan pada peta')}>
        {#each categories as c}<button class:chosen={filter===c.id} aria-pressed={filter===c.id} onclick={()=>filter=c.id}><c.icon size={17}/><span>{c.label}</span><b>{c.n}</b></button>{/each}
      </div>
      {#if area}<Map {area} {filter} {lang}/>{:else}<div class="map placeholder">{t('Preparing your map…', 'Menyediakan peta…')}</div>{/if}
      <div class="map-feedback" role="status" aria-live="polite" aria-atomic="true"><span class="status-dot"></span>{#if area}<strong>{area.name}</strong><span>· {activeCategory.label} · {activeCategory.n} {t('mapped features', 'ciri dipetakan')}</span>{/if}</div>
    </div>
  </div>
  {#if area && metrics}
    <div class="reading-heading"><div><span class="eyebrow">{t('WHAT TO LOOK AT', 'APA YANG PERLU DILIHAT')}</span><h2>{area.name}</h2></div><span class="source-chip">OpenStreetMap · {area.fetchedAt.slice(0,10)} · 800 m</span></div>
    <div class="insight-cards">
      <article><span class="insight-icon"><Store size={23}/></span><h3>{t('Who is already here?', 'Siapa yang sudah ada?')}</h3><p class="insight-count"><strong>{metrics.food}</strong> F&B <span>·</span> <strong>{metrics.retail}</strong> {t('retail', 'runcit')}</p><p>{t('Look for similar businesses and neighbours that could complement yours.', 'Cari perniagaan sejenis dan jiran yang boleh melengkapi perniagaan anda.')}</p></article>
      <article><span class="insight-icon"><TrainFront size={23}/></span><h3>{t('How might customers arrive?', 'Bagaimana pelanggan akan datang?')}</h3><p class="insight-count"><strong>{metrics.transport}</strong> {t('transit', 'transit')} <span>·</span> <strong>{metrics.parking}</strong> {t('parking', 'parkir')}</p><p>{t('Mapped features only. Check actual routes, service times and parking capacity.', 'Ciri dipetakan sahaja. Semak laluan, waktu perkhidmatan dan kapasiti parkir sebenar.')}</p></article>
      <article class="insight-question"><span class="insight-icon"><MapPin size={23}/></span><h3>{t('Would your customers come?', 'Adakah pelanggan anda akan datang?')}</h3><p class="insight-count">{t('Still to investigate', 'Masih perlu dikaji')}</p><p>{t('These counts do not show demand. Visit the area and test your business idea.', 'Kiraan ini tidak menunjukkan permintaan. Lawati kawasan dan uji idea perniagaan anda.')}</p></article>
    </div>
    <p class="source-footnote">{t('Real location data, not a complete census. Features may be missing, duplicated or outdated.', 'Data lokasi sebenar, bukan bancian lengkap. Ciri mungkin tiada, bertindih atau lapuk.')} <a href="#method">{t('Sources & limitations', 'Sumber & batasan')}</a></p>
    <div class="tool-next"><ToolIllustration kind="report"/><div><span class="eyebrow">{t('NEXT: PUT THE NUMBERS IN CONTEXT', 'SETERUSNYA: FAHAMI ANGKA')}</span><h2>{t('What would it take to cover your costs?', 'Apa yang diperlukan untuk menampung kos?')}</h2><p>{t('Open the sample analysis for', 'Buka analisis contoh untuk')} <strong>{area.name}</strong>{t(' and try a business scenario.', ' dan cuba senario perniagaan.')}</p><button class="btn navy" onclick={onReport}>{t('Explore this report', 'Lihat laporan ini')}<ArrowRight size={18}/></button><button class="next-secondary" onclick={onRequest}>{t('Request a report for this area', 'Minta laporan untuk kawasan ini')}<ArrowUpRight size={16}/></button></div></div>
  {/if}
  <div class="guidance-link"><ToolIllustration kind="conversation"/><div><h3>{t('Still choosing where to start?', 'Masih memilih lokasi permulaan?')}</h3><p>{t('Bring your business idea and budget. We can talk through location options.', 'Kongsi idea perniagaan dan bajet anda. Kami boleh membincangkan pilihan lokasi.')}</p><a href="#consultation">{t('Help me choose a location', 'Bantu saya memilih lokasi')}<ArrowUpRight size={16}/></a></div></div>
</section>
