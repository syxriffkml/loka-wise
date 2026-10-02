export interface Place { id:string;type:string;lat:number;lon:number;tags:Record<string,string> }
export interface Area {id:string;name:string;city:string;lat:number;lon:number;radius:number;fetchedAt:string;osmTimestamp:string;elements:Place[];source:string;query:string}
export interface RequestRecord {id:string;kind:string;company:string;area:string;business:string;date:string;message:string;status:string;created_at:string}
export function category(p:Place): 'food'|'retail'|'transport'|'parking' {if(p.tags.shop)return 'retail';if(p.tags.amenity==='parking')return 'parking';if(p.tags.railway||p.tags.amenity==='bus_station')return 'transport';return 'food';}
export function counts(a:Area){return {food:a.elements.filter(p=>category(p)==='food').length,retail:a.elements.filter(p=>category(p)==='retail').length,transport:a.elements.filter(p=>category(p)==='transport').length,parking:a.elements.filter(p=>category(p)==='parking').length};}
export function scenario(customers:number,basket:number,days:number,margin:number,fixed:number){
 if(![customers,basket,days,margin,fixed].every(Number.isFinite)||customers<0||basket<=0||days<=0||days>31||margin<=0||margin>100||fixed<0)throw new Error('Invalid scenario inputs');
 const sales=customers*basket*days;return {sales,profit:sales*margin/100-fixed,breakEven:Math.ceil(fixed/(basket*days*margin/100)),low:sales*.75*margin/100-fixed,high:sales*1.25*margin/100-fixed};
}
export const money=(n:number)=>new Intl.NumberFormat('en-MY',{style:'currency',currency:'MYR',maximumFractionDigits:0}).format(n);
