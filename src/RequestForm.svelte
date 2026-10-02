<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { ArrowLeft, ArrowRight, Check, MapPin, FileText, Store, MessagesSquare } from 'lucide-svelte';
  import { stages, type RequestBrief } from './lib/request';
  import { money } from './lib/model';
  import ToolIllustration from './ToolIllustration.svelte';
  import { fullReportPrice } from './lib/pricing';

  let { lang, mode, initialArea = '', onSave }: {
    lang: 'en' | 'ms';
    mode: 'consultation' | 'custom';
    initialArea?: string;
    onSave: (brief: RequestBrief) => Promise<boolean>;
  } = $props();
  const t = (en: string, ms: string) => lang === 'en' ? en : ms;
  let step = $state(1);
  let company = $state('');
  let business = $state('cafe');
  let stage = $state('planning');
  let budget = $state<number | undefined>(undefined);
  let area = $state('');
  let locationMode = $state('known');
  let goal = $state<'locations' | 'report'>('locations');
  let date = $state('');
  let message = $state('');
  let consent = $state(false);
  let saving = $state(false);
  let error = $state('');
  let stepHeading: HTMLHeadingElement;
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuala_Lumpur' }).format(new Date());
  const types = [
    ['cafe', 'Café / bakery', 'Kafe / bakeri'],
    ['restaurant', 'Restaurant / takeaway', 'Restoran / makanan bungkus'],
    ['retail', 'Retail shop', 'Kedai runcit'],
    ['other', 'Other physical outlet', 'Premis fizikal lain']
  ];
  const location = $derived(locationMode === 'undecided' && mode === 'consultation' ? t('Not decided yet', 'Belum pasti') : area.trim());
  onMount(() => { area = initialArea; });

  async function setStep(next: number) {
    step = next;
    await tick();
    stepHeading?.focus({ preventScroll: true });
    stepHeading?.scrollIntoView?.({ block: 'start', behavior: 'instant' });
  }
  async function submit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    if (!company.trim() || !location || message.trim().length < 10) {
      error = t('Enter your name, a location and at least 10 characters about your plans.', 'Masukkan nama, lokasi dan sekurang-kurangnya 10 aksara tentang rancangan anda.');
      await setStep(1);
      return;
    }
    if (step === 1) { consent = false; await setStep(2); return; }
    if (!consent || saving) return;
    saving = true;
    try {
      await onSave({ company: company.trim(), business, stage, budget, area: location, date: mode === 'consultation' ? date : '', message: message.trim(), goal });
    } finally { saving = false; }
  }
</script>

<form class="booking-form brief-form" onsubmit={submit}>
  <div class="form-steps" aria-label={t('Request progress', 'Kemajuan permintaan')}>
    <span class:current={step === 1} aria-current={step === 1 ? 'step' : undefined}><b>{#if step === 2}<Check size={15}/>{:else}1{/if}</b>{t('Your brief', 'Butiran anda')}</span>
    <i aria-hidden="true"></i>
    <span class:current={step === 2} aria-current={step === 2 ? 'step' : undefined}><b>2</b>{t('Review & save', 'Semak & simpan')}</span>
  </div>
  <span class="micro">{mode === 'consultation' ? t('OPTIONAL CONSULTATION', 'PERUNDINGAN PILIHAN') : t('CUSTOM LOCATION REPORT', 'LAPORAN LOKASI TERSUAI')}</span>
  <h2 bind:this={stepHeading} tabindex="-1">{step === 1 ? t('Start with your business', 'Mulakan dengan perniagaan anda') : t('Does everything look right?', 'Adakah semua butiran betul?')}</h2>
  {#if error}<p class="form-error" role="alert">{error}</p>{/if}
  {#if step === 1}
    <p class="form-helper">{t('Use fictional details at the booth. No account needed.', 'Gunakan butiran rekaan di pameran. Tiada akaun diperlukan.')}</p>
    <fieldset class="brief-group">
      <legend><Store size={20}/>{t('Your business profile', 'Profil perniagaan anda')}</legend>
      <label>{t('Your name or business name', 'Nama anda atau perniagaan')}<input required maxlength="120" autocomplete="off" bind:value={company} placeholder={t('e.g. Aminah / Kedai Kopi Aminah', 'cth. Aminah / Kedai Kopi Aminah')}/></label>
      <div class="form-grid">
        <label>{t('Business type', 'Jenis perniagaan')}<select bind:value={business}>{#each types as [key,en,ms]}<option value={key}>{t(en,ms)}</option>{/each}</select></label>
        <label>{t('Business stage', 'Peringkat perniagaan')}<select bind:value={stage}>{#each stages as [key,en,ms]}<option value={key}>{t(en,ms)}</option>{/each}</select></label>
      </div>
      <label>{t('Business budget (RM, optional)', 'Bajet perniagaan (RM, pilihan)')}<input type="number" min="0" max="100000000" step="1" bind:value={budget} placeholder={t('Your estimated available budget', 'Anggaran bajet yang tersedia')}/><small>{t('For starting, relocating or expanding your business.', 'Untuk memulakan, memindahkan atau mengembangkan perniagaan anda.')}</small></label>
    </fieldset>
    <fieldset class="brief-group">
      <legend><MapPin size={20}/>{t('Your location & questions', 'Lokasi & soalan anda')}</legend>
      {#if mode === 'consultation'}
        <fieldset class="choice-group"><legend>{t('What would you like help with?', 'Apakah bantuan yang anda perlukan?')}</legend>
          <label class="choice"><input type="radio" name="goal" value="locations" bind:group={goal}/><MapPin size={19}/><span>{t('Find or compare locations', 'Cari atau bandingkan lokasi')}</span></label>
          <label class="choice"><input type="radio" name="goal" value="report" bind:group={goal}/><FileText size={19}/><span>{t('Understand my report', 'Fahami laporan saya')}</span></label>
        </fieldset>
        <fieldset class="choice-group"><legend>{t('Have you chosen a location?', 'Sudah memilih lokasi?')}</legend><div class="location-choices">
          <label class="choice"><input type="radio" name="location" value="known" bind:group={locationMode}/><span>{t('I have an area in mind', 'Saya ada kawasan pilihan')}</span></label>
          <label class="choice"><input type="radio" name="location" value="undecided" bind:group={locationMode}/><span>{t('Help me choose', 'Bantu saya memilih')}</span></label>
        </div></fieldset>
      {/if}
      {#if locationMode === 'known' || mode === 'custom'}
        <label>{t('Location / address', 'Lokasi / alamat')}<input required maxlength="200" bind:value={area} placeholder={t('Area, town or shop-lot address', 'Kawasan, bandar atau alamat premis')}/><small>{t('An area is enough to start. You can add the exact site in your notes.', 'Nama kawasan sudah memadai. Anda boleh menambah tapak khusus dalam nota.')}</small></label>
      {:else}<p class="form-hint">{t('That’s a good place to start. We can discuss locations around your budget and business needs.', 'Kami boleh membincangkan lokasi mengikut bajet dan keperluan perniagaan anda.')}</p>{/if}
      {#if mode === 'consultation'}<label>{t('Preferred date (optional, Malaysia time)', 'Tarikh pilihan (pilihan, waktu Malaysia)')}<input type="date" min={today} bind:value={date}/><small>{t('Leave blank if you are flexible. A requested date is not a confirmed booking.', 'Biarkan kosong jika fleksibel. Tarikh pilihan bukan tempahan yang disahkan.')}</small></label>{/if}
      <label>{t('What would you like to understand?', 'Apakah yang ingin anda fahami?')}<textarea required minlength="10" maxlength="1800" rows="4" bind:value={message} placeholder={mode === 'consultation' ? t('Tell us about your idea, priorities or questions about a report…', 'Kongsi idea, keutamaan atau soalan tentang laporan…') : t('What are you planning here? Who are your customers, and what concerns you?', 'Apakah rancangan anda di sini? Siapa pelanggan anda dan apakah kebimbangan anda?')}></textarea></label>
    </fieldset>
    <button class="btn navy full" type="submit">{t('Review my request', 'Semak permintaan saya')}<ArrowRight size={18}/></button>
    <p class="form-footnote">{t('You can edit your details before saving.', 'Anda boleh menyunting butiran sebelum menyimpan.')}</p>
  {:else}
    <p class="form-helper">{t('Check your brief before saving it to this browser.', 'Semak butiran sebelum menyimpannya dalam pelayar ini.')}</p>
    <div class="review-identity"><ToolIllustration kind={mode==='custom'?'report':'conversation'}/><div><span class="micro">{mode==='custom'?t('YOUR REPORT BRIEF','BUTIRAN LAPORAN ANDA'):t('YOUR CONSULTATION BRIEF','BUTIRAN PERUNDINGAN ANDA')}</span><strong>{company}</strong><span><MapPin size={16}/>{location}</span></div></div>
    <dl class="brief-summary">
      <div><dt>{t('Business profile', 'Profil perniagaan')}</dt><dd>{t(...types.find(s => s[0] === business)!.slice(1) as [string,string])}<small>{t(...stages.find(s => s[0] === stage)!.slice(1) as [string,string])}</small></dd></div>
      <div><dt>{t('Business budget', 'Bajet perniagaan')}</dt><dd>{budget === undefined ? t('Not specified', 'Tidak dinyatakan') : money(budget)}</dd></div>
      {#if mode === 'consultation'}<div><dt>{t('Consultation focus', 'Fokus perundingan')}</dt><dd>{goal === 'report' ? t('Understand my report', 'Fahami laporan saya') : t('Find or compare locations', 'Cari atau bandingkan lokasi')}</dd></div><div><dt>{t('Preferred date', 'Tarikh pilihan')}</dt><dd>{date || t('Flexible / to discuss', 'Fleksibel / untuk dibincangkan')}</dd></div>{/if}
      <div><dt>{t('Your questions', 'Soalan anda')}</dt><dd class="summary-message">{message}</dd></div>
    </dl>
    <div class="quote-note">{#if mode === 'custom'}{t('Full feasibility report from', 'Laporan kebolehlaksanaan penuh dari')} <strong>{money(fullReportPrice)}</strong>.{' '}{/if}{t('Provisional pricing. Scope and final quote agreed before any work starts.', 'Harga sementara. Skop dan sebut harga akhir dipersetujui sebelum kajian bermula.')}</div>
    <label class="checkbox"><input type="checkbox" required bind:checked={consent}/><span>{t('I understand this is a local demonstration request. Nothing is sent and no payment or booking is made.', 'Saya faham ini permintaan demonstrasi tempatan. Tiada butiran dihantar, pembayaran atau tempahan dibuat.')}</span></label>
    <button class="btn navy full" type="submit" disabled={saving}>{saving ? t('Saving…', 'Menyimpan…') : t('Save demo request', 'Simpan permintaan demo')}<Check size={18}/></button>
    <button class="edit-brief" type="button" disabled={saving} onclick={()=>setStep(1)}><ArrowLeft size={16}/>{t('Edit my details', 'Sunting butiran saya')}</button>
  {/if}
</form>
