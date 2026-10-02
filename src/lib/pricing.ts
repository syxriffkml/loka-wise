import pricing from '../../supabase/functions/_shared/pricing.json';
export const fullReportPrice = pricing.amount / 100;
export const services = [
 {en:'Full location feasibility report',ms:'Laporan kebolehlaksanaan lokasi penuh',price:fullReportPrice,description:'A combined assessment tailored to your business and chosen location.',descriptionMs:'Penilaian menyeluruh berdasarkan perniagaan dan lokasi pilihan anda.'},
 {en:'Site shortlist review',ms:'Semakan senarai pendek tapak',price:1800,description:'Compare the locations you are considering.',descriptionMs:'Bandingkan lokasi yang anda pertimbangkan.'},
 {en:'Catchment & footfall study',ms:'Kajian kawasan tadahan & trafik pejalan kaki',price:2800,description:'Proposed research; fieldwork and data scope agreed in your quote.',descriptionMs:'Kajian dicadangkan; skop kerja lapangan dan data dipersetujui dalam sebut harga.'},
 {en:'Competitor & saturation mapping',ms:'Pemetaan pesaing & ketepuan',price:1500,description:'Understand the nearby business mix and competition.',descriptionMs:'Fahami gabungan perniagaan dan persaingan sekitar.'},
 {en:'Rental benchmarking',ms:'Penandaarasan sewaan',price:900,description:'Compare rental evidence where verified information is available.',descriptionMs:'Bandingkan bukti sewaan apabila maklumat disahkan tersedia.'},
 {en:'Multi-outlet overlap review',ms:'Semakan pertindihan cawangan',price:2400,description:'Explore how a new outlet could overlap with your existing locations.',descriptionMs:'Terokai pertindihan cawangan baharu dengan lokasi sedia ada.'}
];
