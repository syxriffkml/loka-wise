import { category, type Area, type Place } from './model';
type Language = 'en' | 'ms';
const labels: Record<string, [string, string]> = {
  restaurant: ['Restaurant', 'Restoran'], cafe: ['Café', 'Kafe'], fast_food: ['Fast food', 'Makanan segera'],
  food_court: ['Food court', 'Medan selera'], bar: ['Bar', 'Bar'], pub: ['Pub', 'Pub'],
  convenience: ['Convenience store', 'Kedai serbaneka'], supermarket: ['Supermarket', 'Pasar raya'],
  bakery: ['Bakery', 'Bakeri'], clothes: ['Clothing shop', 'Kedai pakaian'], hairdresser: ['Hair salon', 'Salun rambut'],
  beauty: ['Beauty shop', 'Kedai kecantikan'], laundry: ['Laundry', 'Dobi'], bicycle: ['Bicycle shop', 'Kedai basikal'],
  mobile_phone: ['Mobile phone shop', 'Kedai telefon'], car_repair: ['Vehicle repair', 'Bengkel kenderaan'],
  parking: ['Parking feature', 'Ciri parkir'], station: ['Station', 'Stesen'], bus_station: ['Bus station', 'Stesen bas'],
  yes: ['Yes', 'Ya'], no: ['No', 'Tidak'], limited: ['Limited', 'Terhad'],
  surface: ['Surface parking', 'Parkir permukaan'], multi_storey: ['Multi-storey parking', 'Parkir bertingkat'],
  underground: ['Underground parking', 'Parkir bawah tanah']
};
function tagLabel(value: string, lang: Language) {
  return value.split(';').map(v => labels[v.trim()]?.[lang === 'en' ? 0 : 1] || v.trim().replaceAll('_', ' ').replace(/^\w/, c => c.toUpperCase())).join(', ');
}
export function placeName(place: Place, lang: Language) {
  return place.tags[`name:${lang}`] || place.tags.name || place.tags.brand || tagLabel(place.tags.shop || place.tags.amenity || place.tags.railway || 'Mapped place', lang);
}
export function distanceFromStudyPoint(place: Place, area: Area) {
  const rad = (v: number) => v * Math.PI / 180;
  const h = Math.sin(rad(place.lat - area.lat) / 2) ** 2 + Math.cos(rad(area.lat)) * Math.cos(rad(place.lat)) * Math.sin(rad(place.lon - area.lon) / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
}
export function safeWebsite(raw?: string): string | null {
  if (!raw) return null;
  const value = raw.trim();
  const absolute = /^https?:\/\//i.test(value) ? value : /^[\w-]+(?:\.[\w-]+)+(?:\/[^\s]*)?$/.test(value) ? `https://${value}` : '';
  try { const url = new URL(absolute); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
/** OSM values are text nodes, never interpolated into HTML. */
export function createPlacePopup(place: Place, area: Area, lang: Language): HTMLElement {
  const t = (en: string, ms: string) => lang === 'en' ? en : ms;
  const tags = place.tags;
  const root = document.createElement('article'); root.className = 'place-card';
  const add = (tag: string, className: string, text: string, parent: HTMLElement = root) => {
    const element = document.createElement(tag); element.className = className; element.textContent = text; parent.append(element); return element;
  };
  const group = category(place);
  const groupName = group === 'food' ? 'F&B' : group === 'retail' ? t('Retail', 'Runcit') : group === 'transport' ? t('Transport', 'Pengangkutan') : t('Parking', 'Parkir');
  const subtype = tagLabel(tags.shop || tags.amenity || tags.railway || '', lang);
  add('span', `place-category ${group}`, `${groupName}${subtype ? ` · ${subtype}` : ''}`);
  add('h3', 'place-name', placeName(place, lang));
  add('p', 'place-area', `${area.name} · ${area.city}`);
  const distance = distanceFromStudyPoint(place, area);
  const distanceText = distance < 1000 ? `~${Math.round(distance / 10) * 10} m` : `~${(distance / 1000).toFixed(1)} km`;
  add('p', 'place-distance', `${distanceText} ${t('from study point · straight line', 'dari titik kajian · garis lurus')}`);
  const details = document.createElement('dl'); details.className = 'place-facts'; root.append(details);
  const fact = (label: string, value?: string) => {
    if (!value) return;
    const row = document.createElement('div'); details.append(row);
    add('dt', '', label, row); add('dd', '', value, row);
  };
  const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(', ');
  const locality = [tags['addr:postcode'] || tags.postal_code, tags['addr:city']].filter(Boolean).join(' ');
  const address = [tags['addr:unit'], street, tags['addr:neighbourhood'], locality].filter(Boolean).join(', ');
  fact(t('Address (mapped)', 'Alamat (dipetakan)'), tags['addr:full'] || address);
  fact(t('Cuisine', 'Jenis masakan'), tags.cuisine ? tagLabel(tags.cuisine, lang) : undefined);
  fact(t('Hours (mapped)', 'Waktu (dipetakan)'), tags.opening_hours === '24/7' ? t('24 hours, every day', '24 jam, setiap hari') : tags.opening_hours);
  fact(t('Operator', 'Pengendali'), tags.operator);
  fact(t('Level', 'Aras'), tags.level);
  fact(t('Parking type', 'Jenis parkir'), tags.parking ? tagLabel(tags.parking, lang) : undefined);
  fact(t('Wheelchair access (mapped)', 'Akses kerusi roda (dipetakan)'), tags.wheelchair ? tagLabel(tags.wheelchair, lang) : undefined);
  fact(t('Takeaway (mapped)', 'Bungkus (dipetakan)'), tags.takeaway ? tagLabel(tags.takeaway, lang) : undefined);
  fact(t('OSM note', 'Nota OSM'), tags.description);
  const phone = tags['contact:phone'] || tags.phone;
  const website = safeWebsite(tags['contact:website'] || tags.website);
  if (phone) fact(t('Phone (mapped)', 'Telefon (dipetakan)'), phone);
  if (!address && !tags['addr:full'] && !tags.opening_hours && !phone && !website) {
    add('p', 'place-missing', t('Address, hours and contact details are not listed in this snapshot.', 'Alamat, waktu dan butiran hubungan tidak disenaraikan dalam snapshot ini.'));
  }
  const links = document.createElement('div'); links.className = 'place-links'; root.append(links);
  const link = (label: string, href: string, external = true) => {
    const a = document.createElement('a'); a.textContent = label; a.href = href;
    if (external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    links.append(a);
  };
  if (website) link(t('Website ↗', 'Laman web ↗'), website);
  const firstPhone = phone?.split(';')[0].trim();
  if (firstPhone && /^\+?[\d\s().-]{5,}$/.test(firstPhone)) link(t('Call', 'Telefon'), `tel:${firstPhone.replace(/[^\d+]/g, '')}`, false);
  if (['node', 'way', 'relation'].includes(place.type) && /^\d+$/.test(place.id)) link(t('View on OpenStreetMap ↗', 'Lihat di OpenStreetMap ↗'), `https://www.openstreetmap.org/${place.type}/${place.id}`);
  add('p', 'place-source', `${t('Saved', 'Disimpan')} ${area.fetchedAt.slice(0,10)} · OpenStreetMap\n${t('Details may have changed. Confirm before visiting.', 'Butiran mungkin berubah. Sahkan sebelum melawat.')}`);
  return root;
}
