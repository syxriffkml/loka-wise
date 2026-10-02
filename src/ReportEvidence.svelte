<script lang="ts">
  import type { Area } from './lib/model';
  import { reportEvidence } from './lib/report-evidence';
  let { area, lang }: { area: Area; lang: 'en'|'ms' } = $props();
  const t = (en:string, ms:string) => lang==='en'?en:ms;
  const evidence = $derived(reportEvidence(area,lang));
  const circumference = 2*Math.PI*66;
</script>

<section class="evidence-report" aria-labelledby="evidence-title">
  <div class="report-section-title"><span>01</span><div><p class="eyebrow">{t('LOCATION EVIDENCE', 'BUKTI LOKASI')}</p><h2 id="evidence-title">{t('The area at a glance', 'Gambaran kawasan')}</h2></div><span class="source-chip">{t('Mapped data', 'Data dipetakan')}</span></div>
  <div class="evidence-stats">
    <div><strong>{area.elements.length}</strong><span>{t('mapped features', 'ciri dipetakan')}</span></div>
    <div><strong>{evidence.businessTotal}</strong><span>{t('F&B + retail features', 'ciri F&B + peruncitan')}</span></div>
    <div><strong>{area.radius}<small> m</small></strong><span>{t('study radius', 'radius kajian')}</span></div>
    <div><strong>{evidence.retailShare}<small>%</small></strong><span>{t('retail share of mapped businesses', 'bahagian runcit dalam perniagaan dipetakan')}</span></div>
  </div>
  <div class="report-chart-grid">
    <figure class="report-chart-card">
      <figcaption><span class="chart-number">A /</span><h3>{t('What surrounds the location?', 'Apa di sekitar lokasi?')}</h3><p>{t('Share of all mapped features in the study area.', 'Bahagian semua ciri dipetakan dalam kawasan kajian.')}</p></figcaption>
      <div class="mix-chart">
        <svg viewBox="0 0 180 180" role="img" aria-label={t(`Composition of ${area.elements.length} mapped features. Counts and percentages follow.`, `Komposisi ${area.elements.length} ciri dipetakan. Kiraan dan peratusan berikut.`)}>
          <circle cx="90" cy="90" r="66" fill="none" stroke="#edece5" stroke-width="23"/>
          {#each evidence.categories as row,i}
            <circle cx="90" cy="90" r="66" fill="none" stroke={row.color} stroke-width="23" stroke-dasharray={`${row.share/100*circumference} ${circumference}`} stroke-dashoffset={-evidence.categories.slice(0,i).reduce((sum,r)=>sum+r.share/100*circumference,0)} transform="rotate(-90 90 90)"/>
          {/each}
          <text x="90" y="91" text-anchor="middle" class="donut-total">{area.elements.length}</text><text x="90" y="111" text-anchor="middle" class="donut-caption">{t('mapped', 'dipetakan')}</text>
        </svg>
        <ul class="chart-legend">{#each evidence.categories as row}<li><i style:background={row.color}></i><span>{row.label}</span><strong>{row.value}</strong><small>{row.share.toFixed(1)}%</small></li>{/each}</ul>
      </div>
      <p class="chart-reading">{t(`${evidence.businessTotal} mapped F&B and retail features give you a starting list for a site visit.`, `${evidence.businessTotal} ciri F&B dan peruncitan dipetakan menyediakan senarai awal untuk lawatan tapak.`)}</p>
    </figure>
    <figure class="report-chart-card">
      <figcaption><span class="chart-number">B /</span><h3>{t('Most mapped business types', 'Jenis perniagaan paling banyak dipetakan')}</h3><p>{t('Six largest groups by feature count. Bars start at zero.', 'Enam kumpulan terbesar mengikut kiraan ciri. Bar bermula pada sifar.')}</p></figcaption>
      <ol class="type-bar-chart">{#each evidence.topTypes as row}<li><div><span>{row.label}</span><strong>{row.value}</strong></div><svg viewBox="0 0 300 9" preserveAspectRatio="none" aria-hidden="true"><rect width="300" height="9" rx="4.5" fill="#eeeee7"/><rect width={row.value/(evidence.topTypes[0]?.value||1)*300} height="9" rx="4.5" fill="#0b3046"/></svg></li>{/each}</ol>
      <p class="chart-reading">{t('Use this to shortlist businesses to investigate. Category counts alone do not establish direct competition.', 'Gunakan ini untuk menyenarai pendek perniagaan untuk dikaji. Kiraan kategori sahaja tidak menentukan persaingan langsung.')}</p>
    </figure>
  </div>
  <div class="report-finding"><span class="eyebrow">{t('WHAT THIS MEANS FOR YOU', 'MAKNANYA UNTUK ANDA')}</span><p>{t('You can see the mapped business mix. The next decision is whether your offer, price and opening hours fit the customers on this street.', 'Anda boleh melihat campuran perniagaan dipetakan. Keputusan seterusnya ialah sama ada tawaran, harga dan waktu operasi anda sesuai dengan pelanggan di jalan ini.')}</p><small>{t('Not yet measured: customer demand, footfall, rents or actual sales. This snapshot may be incomplete, outdated or contain duplicate features.', 'Belum diukur: permintaan pelanggan, trafik pejalan kaki, sewa atau jualan sebenar. Snapshot ini mungkin tidak lengkap, lapuk atau mengandungi ciri bertindih.')}</small></div>
</section>
