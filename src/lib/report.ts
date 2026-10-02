import { jsPDF } from 'jspdf';
import { counts, scenario, type Area } from './model';
import { reportEvidence } from './report-evidence';
import { reportLogo } from './report-logo';

type Inputs = { customers:number; basket:number; days:number; margin:number; fixed:number };
export function createReport(a:Area, lang:string, inputs:Inputs) {
  const doc = new jsPDF();
  const ms = lang === 'ms';
  const t = (en:string,bm:string) => ms ? bm : en;
  const navy = '#0b3046', gold = '#b58a3b', muted = '#536875', line = '#d9ded7';
  const evidence = reportEvidence(a,lang), c = counts(a);
  const r = scenario(inputs.customers,inputs.basket,inputs.days,inputs.margin,inputs.fixed);
  const rm = (n:number) => `${n < 0 ? '-' : ''}RM ${Math.abs(n).toLocaleString('en-MY',{maximumFractionDigits:0})}`;
  doc.setProperties({title:`LOKA WISE | ${a.name} | ${t('Sample location report','Laporan lokasi contoh')}`,author:'LOKA WISE',subject:'OpenStreetMap evidence and illustrative business scenario'});
  function text(s:string,x:number,y:number,size=10,color=navy,bold=false,width?:number) {
    doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(color);
    const lines = width ? doc.splitTextToSize(s,width) : [s];
    doc.text(lines,x,y,{lineHeightFactor:1.35});
    return y + lines.length * size * .3528 * 1.35;
  }
  function box(x:number,y:number,w:number,h:number,fill='#ffffff') {
    doc.setFillColor(fill);doc.setDrawColor(line);doc.setLineWidth(.25);doc.roundedRect(x,y,w,h,2,2,'FD');
  }
  function header(page:number) {
    doc.setFillColor('#faf9f3');doc.rect(0,0,210,297,'F');
    doc.setFillColor(navy);doc.rect(0,0,210,3,'F');
    doc.addImage(reportLogo,'PNG',17,10,42,27.71,'loka-logo','FAST');
    text(t('SAMPLE REPORT','LAPORAN CONTOH'),132,18,9,gold,true);
    text(`${a.name} / ${a.city}`,132,24,8,navy,false,60);
    text(`${a.fetchedAt.slice(0,10)}  |  ${a.radius} m`,132,34,8,muted);
    doc.setDrawColor(line);doc.line(18,41,192,41);
    doc.setDrawColor(gold);doc.line(18,278,192,278);
    text('LOKA WISE',18,287,15,navy,true);
    text('INSIGHTS FOR A STRONGER TOMORROW',18,293,6.5,muted);
    text(`${page} / 2`,181,289,9,navy);
  }
  function metric(x:number,y:number,w:number,value:string,label:string) {
    box(x,y,w,29,navy);text(value,x+5,y+12,19,'#edcd8e',true);text(label,x+5,y+20,8,'#ffffff',false,w-10);
  }
  header(1);
  text(t('01 / LOCATION EVIDENCE','01 / BUKTI LOKASI'),18,51,8,gold,true);
  text(`${a.name}: ${t('location report','laporan lokasi')}`,18,63,25,navy,true);
  text(t('A clearer view of the business mix before you visit the site.','Gambaran campuran perniagaan sebelum anda melawat tapak.'),18,73,10,muted,false,174);
  metric(18,83,41,`${a.elements.length}`,t('Mapped features','Ciri dipetakan'));
  metric(62,83,41,`${evidence.businessTotal}`,t('F&B + retail','F&B + peruncitan'));
  metric(106,83,41,`${evidence.retailShare}%`,t('Retail share*','Bahagian runcit*'));
  metric(150,83,42,`${c.transport} / ${c.parking}`,t('Transit / parking','Transit / parkir'));
  text(t('* Retail share of mapped F&B and retail features. Parking counts are features, not spaces.','* Bahagian runcit dalam ciri F&B dan runcit dipetakan. Kiraan parkir ialah ciri, bukan petak.'),18,118,7.3,muted,false,174);
  box(18,126,83,92);box(106,126,86,92);
  text(t('A / Mapped feature mix','A / Campuran ciri dipetakan'),23,135,10,navy,true);
  text(t('Share of all mapped features','Bahagian semua ciri dipetakan'),23,141,7.7,muted);
  let cursor=23;
  evidence.categories.forEach(row=>{const w=row.share/100*73;doc.setFillColor(row.color);if(w>0)doc.rect(cursor,147,w,8,'F');cursor+=w;});
  evidence.categories.forEach((row,i)=>{
    const y=166+i*12;doc.setFillColor(row.color);doc.circle(25,y-1,1.4,'F');
    text(row.label,29,y,8.5);text(`${row.value}  /  ${row.share.toFixed(1)}%`,66,y,8.5,navy,true);
  });
  text(t('B / Top business types','B / Jenis perniagaan teratas'),111,135,10,navy,true);
  text(t('Six largest groups. Count, from zero.','Enam kumpulan terbesar. Kiraan dari sifar.'),111,141,7.2,muted);
  evidence.topTypes.forEach((row,i)=>{
    const y=150+i*10.5;text(row.label,111,y,8);text(String(row.value),180,y,8,navy,true);
    doc.setFillColor('#edece5');doc.rect(111,y+2,75,2.5,'F');
    doc.setFillColor(navy);doc.rect(111,y+2,row.value/(evidence.topTypes[0]?.value||1)*75,2.5,'F');
  });
  box(18,224,174,28,'#f2e7ce');
  text(t('THE TAKEAWAY','DAPATAN UTAMA'),23,232,8,gold,true);
  text(t(`${evidence.businessTotal} mapped F&B and retail features provide a starting list for site visits. Check the customer fit, offers and prices; counts alone do not establish demand or direct competition.`,`${evidence.businessTotal} ciri F&B dan peruncitan dipetakan menyediakan senarai awal lawatan tapak. Semak kesesuaian pelanggan, tawaran dan harga; kiraan sahaja tidak menentukan permintaan atau persaingan langsung.`),23,238,8.6,navy,false,164);
  text(t('Evidence limits: an incomplete snapshot, not a verified business census. Features may be duplicated or outdated. Footfall, rents and actual sales have not been measured.','Had bukti: snapshot tidak lengkap, bukan bancian perniagaan yang disahkan. Ciri mungkin bertindih atau lapuk. Trafik pejalan kaki, sewa dan jualan sebenar belum diukur.'),18,259,7.4,muted,false,174);
  text('OpenStreetMap contributors / ODbL 1.0 / openstreetmap.org/copyright',18,272,7,muted);
  doc.link(18,269,174,5,{url:'https://www.openstreetmap.org/copyright'});

  doc.addPage();header(2);
  text(t('02 / BUSINESS SCENARIO','02 / SENARIO PERNIAGAAN'),18,51,8,gold,true);
  text(t('What would it take to work?','Apa yang diperlukan?'),18,63,24,navy,true);
  text(t('Your current assumptions, translated into monthly operating results.','Andaian semasa anda, diterjemahkan kepada hasil operasi bulanan.'),18,73,10,muted,false,174);
  metric(18,83,56,rm(r.sales),t('Monthly sales, before costs','Jualan bulanan, sebelum kos'));
  metric(77,83,56,rm(r.profit),t('Operating surplus / shortfall','Lebihan / kekurangan operasi'));
  metric(136,83,56,String(r.breakEven),t('Break-even customers / day','Pelanggan pulang modal / hari'));
  text(t('YOUR FIVE INPUTS','LIMA INPUT ANDA'),18,124,9,gold,true);
  const inputRows = [
    [t('Customers per day','Pelanggan sehari'),String(inputs.customers)],
    [t('Average spend','Belanja purata'),rm(inputs.basket)],
    [t('Open days per month','Hari buka sebulan'),String(inputs.days)],
    [t('Contribution margin','Margin sumbangan'),`${inputs.margin}%`],
    [t('Monthly fixed costs','Kos tetap bulanan'),rm(inputs.fixed)],
  ];
  inputRows.forEach(([label,value],i)=>{
    const y=133+i*8.2;text(label,18,y,8.2);text(value,78,y,8.2,navy,true);doc.setDrawColor(line);doc.line(18,y+3,104,y+3);
  });
  box(113,121,79,51,'#f2e7ce');
  text(t('READING THE RESULT','MEMAHAMI HASIL'),118,129,8,gold,true);
  const gap=Math.max(0,Math.ceil(r.breakEven-inputs.customers));
  text(gap>0?t(`You need about ${gap} more customers a day to cover these costs.`,`Anda memerlukan kira-kira ${gap} lagi pelanggan sehari untuk menampung kos ini.`):t(`Your estimate of ${inputs.customers} customers a day covers these operating costs.`,`Anggaran ${inputs.customers} pelanggan sehari menampung kos operasi ini.`),118,137,9,navy,true,69);
  text(t('Whether that customer volume is achievable still needs checking.','Keupayaan mencapai jumlah pelanggan itu masih perlu disemak.'),118,157,8,muted,false,69);
  text(t('IF CUSTOMER VOLUME CHANGES','JIKA JUMLAH PELANGGAN BERUBAH'),18,184,9,gold,true);
  text(t('Monthly operating surplus / shortfall (RM). All other inputs stay the same.','Lebihan / kekurangan operasi bulanan (RM). Semua input lain kekal.'),18,190,7.8,muted,false,174);
  const rows=[{label:t('25% fewer','Kurang 25%'),value:r.low},{label:t('Current','Semasa'),value:r.profit},{label:t('25% more','Lebih 25%'),value:r.high}];
  const min=Math.min(0,r.low,r.profit,r.high),max=Math.max(0,r.low,r.profit,r.high),span=max-min||1;
  const axis=62+(-min/span)*98;
  doc.setDrawColor('#a1afa9');doc.setLineWidth(.3);doc.line(axis,197,axis,234);
  rows.forEach((row,i)=>{const y=201+i*12;text(row.label,18,y+4,8.5);doc.setFillColor(row.value<0?'#a65341':i===1?gold:navy);const w=Math.abs(row.value)/span*98;if(w>0)doc.rect(row.value<0?62+(row.value-min)/span*98:axis,y,w,7,'F');text(rm(row.value),165,y+4,8.5,navy,true);});
  text('0',axis-1,239,7,muted);
  text(t('This is a scenario calculation, not a demand forecast. The +/-25% comparison is not a statistical confidence interval. Tax, financing and startup costs are excluded.','Ini pengiraan senario, bukan ramalan permintaan. Perbandingan +/-25% bukan selang keyakinan statistik. Cukai, pembiayaan dan kos permulaan tidak dimasukkan.'),18,246,7.8,muted,false,174);
  text(t('NEXT: verify rent and lease terms, observe footfall, visit competitors and test demand.','SETERUSNYA: sahkan sewa dan pajakan, amati trafik pejalan kaki, lawati pesaing dan uji permintaan.'),18,261,8,navy,true,174);
  text(`${t('Sample location report','Laporan demonstrasi lokasi')} / OSM ${a.osmTimestamp}`,18,273,6.7,muted);
  doc.link(18,270,174,5,{url:a.source});
  return doc;
}

export function downloadReport(a:Area,lang:string,inputs:Inputs) {
  createReport(a,lang,inputs).save(`LOKA-WISE-${a.id}-${lang}-sample.pdf`);
}
