import { category, counts, type Area } from './model';

export const reportColors = ['#0b3046', '#b58a3b', '#56817b', '#8b96a3'];
const typeLabels: Record<string, [string, string]> = {
  restaurant: ['Restaurants', 'Restoran'], cafe: ['Cafés', 'Kafe'], fast_food: ['Fast food', 'Makanan segera'],
  convenience: ['Convenience stores', 'Kedai serbaneka'], laundry: ['Laundries', 'Dobi'],
  hairdresser: ['Hair salons', 'Salun rambut'], beauty: ['Beauty shops', 'Kedai kecantikan'],
  furniture: ['Furniture stores', 'Kedai perabot'], supermarket: ['Supermarkets', 'Pasar raya'],
  clothes: ['Clothing stores', 'Kedai pakaian'], food_court: ['Food courts', 'Medan selera'],
};

// One shared aggregation for the screen and PDF; each saved feature is counted once.
export function reportEvidence(area: Area, lang: string) {
  const ms = lang === 'ms';
  const c = counts(area);
  const categories = [
    { label: 'F&B', value: c.food },
    { label: ms ? 'Peruncitan' : 'Retail', value: c.retail },
    { label: ms ? 'Pengangkutan' : 'Transport', value: c.transport },
    { label: ms ? 'Parkir' : 'Parking', value: c.parking },
  ].map((row, i) => ({ ...row, color: reportColors[i], share: area.elements.length ? row.value / area.elements.length * 100 : 0 }));
  const groups = new Map<string, number>();
  for (const p of area.elements) {
    const cat = category(p);
    if (cat !== 'food' && cat !== 'retail') continue;
    const key = p.tags.shop || p.tags.amenity || 'other';
    groups.set(key, (groups.get(key) || 0) + 1);
  }
  const topTypes = [...groups].sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0])).slice(0,6)
    .map(([key,value]) => ({ key, value, label: typeLabels[key]?.[ms ? 1 : 0] || key.replaceAll('_',' ') }));
  const businessTotal = c.food + c.retail;
  const retailShare = businessTotal ? Math.round(c.retail / businessTotal * 100) : 0;
  return { categories, topTypes, businessTotal, retailShare };
}
