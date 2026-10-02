import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/svelte';
import fs from 'node:fs';
import App from '../src/App.svelte';
import {downloadReport} from '../src/lib/report';
vi.mock('../src/lib/backend',()=>({supabase:null}));
vi.mock('../src/lib/report',()=>({downloadReport:vi.fn()}));
vi.mock('leaflet',()=>{const chain=()=>{const o:any={};for(const k of ['setView','addTo','on','clearLayers','remove','bindPopup'])o[k]=vi.fn(()=>o);o.getElement=vi.fn(()=>document.createElement("div"));return o;};return {default:{map:chain,tileLayer:chain,layerGroup:chain,circle:chain,circleMarker:chain,marker:chain,divIcon:vi.fn(o=>o)}};});
const data=JSON.parse(fs.readFileSync('public/data/locations.json','utf8'));
beforeEach(()=>{window.matchMedia=vi.fn().mockReturnValue({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()});localStorage.clear();window.location.hash='explore';vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>data})));window.scrollTo=vi.fn();});
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.clearAllMocks();});
async function route(name:string){window.location.hash=name;window.dispatchEvent(new Event('hashchange'));await new Promise(r=>setTimeout(r,0));}
describe('booth customer journey without Supabase',()=>{
 it('opens with the story and routes to custom service pricing',async()=>{window.location.hash='';render(App);await screen.findByRole('heading',{name:/Your business idea. The right location./});await fireEvent.click(screen.getByRole('link',{name:'Services',exact:true}));await screen.findByRole('heading',{name:'Full location feasibility report'});expect(screen.getByText('RM 4,500')).toBeTruthy();await fireEvent.click(screen.getByRole('link',{name:'Tell us about your location'}));await screen.findByRole('heading',{name:'Start with your business'});expect(screen.getByLabelText('Business stage')).toBeTruthy();});
 it('opens an accessible drawer and closes it after navigating',async()=>{render(App);await screen.findByRole('heading',{name:'Location explorer'});const trigger=screen.getByRole('button',{name:'Open menu'});await fireEvent.click(trigger);const drawer=screen.getByRole('dialog');expect(document.body.style.overflow).toBe('hidden');expect(drawer.querySelector('[aria-current="page"]')?.textContent).toContain('Location insights');await fireEvent.click(screen.getByRole('link',{name:/04.*Sample analysis/}));await screen.findByRole('heading',{name:'What would it take to break even?'});expect(screen.queryByRole('dialog')).toBeNull();expect(document.body.style.overflow).not.toBe('hidden');await fireEvent.click(trigger);await fireEvent.keyDown(screen.getByRole('dialog'),{key:'Escape'});expect(screen.queryByRole('dialog')).toBeNull();});
 it('keeps the active page when using skip to content',async()=>{render(App);await route('services');await screen.findByRole('heading',{name:'Full location feasibility report'});await route('main');expect(screen.getByRole('heading',{name:'Full location feasibility report'})).toBeTruthy();});
 it('handles non-array stored demo data without crashing',async()=>{localStorage.setItem('loka-v2-demo-requests','{"invalid":true}');render(App);await route('dashboard');expect(screen.getAllByRole('heading',{name:/Kopi & Co. Studio/})).toHaveLength(2);});
 it('does not claim a request was saved when browser storage fails',async()=>{render(App);await route('custom');await fireEvent.input(screen.getByRole('textbox',{name:'Your name or business name'}),{target:{value:'Test owner'}});await fireEvent.input(screen.getByLabelText(/Location .*address/),{target:{value:'SS15'}});await fireEvent.input(screen.getByRole('textbox',{name:'What would you like to understand?'}),{target:{value:'Please assess this location for my cafe.'}});await fireEvent.submit(screen.getByRole('button',{name:'Review my request'}).closest('form')!);await screen.findByRole('heading',{name:'Does everything look right?'});await fireEvent.click(screen.getByRole('checkbox'));const fail=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('Storage full');});await fireEvent.submit(screen.getByRole('button',{name:'Save demo request'}).closest('form')!);expect(await screen.findByText(/This request was not saved/)).toBeTruthy();await fireEvent.click(screen.getByRole('button',{name:'Edit my details'}));expect(screen.getByRole('textbox',{name:'Your name or business name'})).toHaveProperty('value','Test owner');fail.mockRestore();});
 it('loads real snapshots, filters areas and selects TTDI',async()=>{render(App);await screen.findByRole('button',{name:/TTDI Kuala Lumpur/});await fireEvent.click(screen.getByRole('button',{name:/TTDI Kuala Lumpur/}));expect(screen.getByRole('heading',{name:'TTDI'})).toBeTruthy();await fireEvent.input(screen.getByRole('textbox',{name:'Search locations'}),{target:{value:'missing-area'}});expect(screen.getByText(/No matching area/)).toBeTruthy();});
 it('updates scenario and sends current assumptions to the PDF generator',async()=>{render(App);await screen.findByRole('button',{name:'Explore this report'});await fireEvent.click(screen.getByRole('button',{name:'Explore this report'}));await screen.findByRole('heading',{name:'What would it take to break even?'});await fireEvent.input(screen.getByRole('spinbutton',{name:'Customers per day'}),{target:{value:'100'}});expect(screen.getByText('RM 46,800')).toBeTruthy();await fireEvent.click(screen.getByRole('button',{name:'Download sample PDF'}));expect(downloadReport).toHaveBeenCalledWith(expect.objectContaining({id:'ss15'}),'en',expect.objectContaining({customers:100}));});
 it('saves a fictional consultation locally and persists it after remount',async()=>{render(App);await route('consultation');await fireEvent.input(screen.getByRole('textbox',{name:'Your name or business name'}),{target:{value:'Test Café Sdn Bhd'}});await fireEvent.input(screen.getByLabelText(/Location .*address/),{target:{value:'SS15'}});await fireEvent.input(screen.getByRole('textbox',{name:'What would you like to understand?'}),{target:{value:'Compare two café sites with different rental costs.'}});await fireEvent.input(screen.getByLabelText(/Preferred date/),{target:{value:'2027-01-15'}});await fireEvent.submit(screen.getByRole('button',{name:'Review my request'}).closest('form')!);await screen.findByRole('heading',{name:'Does everything look right?'});await fireEvent.click(screen.getByRole('checkbox'));await fireEvent.submit(screen.getByRole('button',{name:'Save demo request'}).closest('form')!);await screen.findByRole('heading',{name:/SS15 · Test Café Sdn Bhd/});expect(JSON.parse(localStorage.getItem('loka-v2-demo-requests')!)).toHaveLength(3);cleanup();render(App);await screen.findByRole('heading',{name:/SS15 · Test Café Sdn Bhd/});});
 it('switches language and keeps the booth journey free of account setup',async()=>{render(App);await fireEvent.click(screen.getByRole('button',{name:'Switch to Bahasa Malaysia'}));expect(screen.getByRole('heading',{name:/Apa yang ada di sekitar perniagaan anda/})).toBeTruthy();await route('custom');expect(screen.getByRole('button',{name:'Semak permintaan saya'})).toBeTruthy();expect(screen.queryByRole('button',{name:'Log masuk'})).toBeNull();});
 it('carries the selected TTDI snapshot into a custom request',async()=>{render(App);await fireEvent.click(await screen.findByRole('button',{name:/TTDI Kuala Lumpur/}));await fireEvent.click(screen.getByRole('button',{name:'Explore this report'}));await fireEvent.click(await screen.findByRole('link',{name:'Request my custom report'}));expect(await screen.findByLabelText(/Location \/ address/)).toHaveProperty('value','TTDI');});
 it('lets an undecided retiree review, edit and save a consultation without a date',async()=>{render(App);await route('consultation');await fireEvent.input(screen.getByLabelText('Your name or business name'),{target:{value:'Aminah Demo'}});await fireEvent.change(screen.getByLabelText('Business stage'),{target:{value:'retirement'}});await fireEvent.click(screen.getByRole('radio',{name:'Help me choose'}));await fireEvent.input(screen.getByLabelText('What would you like to understand?'),{target:{value:'Help me find a location for a small bakery.'}});await fireEvent.submit(screen.getByRole('button',{name:'Review my request'}).closest('form')!);expect(await screen.findByText('Not decided yet')).toBeTruthy();await fireEvent.click(screen.getByRole('button',{name:'Edit my details'}));expect(screen.getByLabelText('Your name or business name')).toHaveProperty('value','Aminah Demo');await fireEvent.submit(screen.getByRole('button',{name:'Review my request'}).closest('form')!);await fireEvent.click(screen.getByRole('checkbox'));await fireEvent.submit(screen.getByRole('button',{name:'Save demo request'}).closest('form')!);expect(await screen.findByRole('heading',{name:'Demo request saved'})).toBeTruthy();const saved=JSON.parse(localStorage.getItem('loka-v2-demo-requests')!)[0];expect(saved.area).toBe('Not decided yet');expect(saved.date).toBe('');expect(saved.message).toContain('after retirement');});
 it('does not carry a consultation date into the separate report journey',async()=>{render(App);await route('consultation');await fireEvent.input(screen.getByLabelText(/Preferred date/),{target:{value:'2027-02-01'}});await route('custom');await fireEvent.input(screen.getByLabelText('Your name or business name'),{target:{value:'Retail Demo'}});await fireEvent.input(screen.getByLabelText(/Location \/ address/),{target:{value:'TTDI'}});await fireEvent.input(screen.getByLabelText('What would you like to understand?'),{target:{value:'Assess this new retail outlet location.'}});await fireEvent.submit(screen.getByRole('button',{name:'Review my request'}).closest('form')!);await fireEvent.click(screen.getByRole('checkbox'));await fireEvent.submit(screen.getByRole('button',{name:'Save demo request'}).closest('form')!);await screen.findByRole('heading',{name:'Demo request saved'});expect(JSON.parse(localStorage.getItem('loka-v2-demo-requests')!)[0].date).toBe('');});
 it('reset clears only the local demonstration workspace',async()=>{localStorage.setItem('loka-v2-demo-requests',JSON.stringify([{...data,id:'x',kind:'report',company:'Temporary',area:'SS15',message:'Local test request',status:'requested'}]));render(App);await route('dashboard');await fireEvent.click(screen.getByRole('button',{name:'Reset demo'}));const dialog=screen.getByRole('dialog');await fireEvent.click(dialog.querySelector('button')!);await waitFor(()=>expect(screen.queryByRole('heading',{name:/Temporary/})).toBeNull());expect(localStorage.getItem('loka-v2-demo-requests')).toBeNull();expect(screen.getAllByRole('heading',{name:/Kopi & Co. Studio/})).toHaveLength(2);});
});

describe('self-explanatory location tools',()=>{
 it('keeps the chosen category and announces its count when the area changes',async()=>{
  render(App);
  await fireEvent.click(await screen.findByRole('button',{name:'Retail 120'}));
  expect(screen.getByRole('status').textContent).toContain('SS15');
  expect(screen.getByRole('status').textContent).toContain('120 mapped features');
  await fireEvent.click(screen.getByRole('button',{name:'TTDI Kuala Lumpur'}));
  expect(screen.getByRole('button',{name:'Retail 167'}).getAttribute('aria-pressed')).toBe('true');
  expect(screen.getByRole('status').textContent).toContain('167 mapped features');
 });
 it('preserves separate example and personal estimates across mode and page changes',async()=>{
  render(App); await route('reports');
  await fireEvent.click(await screen.findByRole('button',{name:'Use my numbers'}));
  expect(screen.getByRole('button',{name:'Download sample PDF'})).toHaveProperty('disabled',true);
  expect(screen.queryByText('RM 30,420')).toBeNull();
  const values:[string,string][]=[['Customers per day','40'],['Average spend (RM)','20'],['Open days / month','25'],['Monthly fixed costs (RM)','15000'],['Contribution margin (%)','60']];
  for(const [name,value] of values)await fireEvent.input(screen.getByRole('spinbutton',{name}),{target:{value}});
  expect(screen.getByText('RM 20,000')).toBeTruthy();
  expect(screen.getByText(/You would need about 10 more customers/)).toBeTruthy();
  expect(screen.getByRole('button',{name:'Download sample PDF'})).toHaveProperty('disabled',false);
  await fireEvent.click(screen.getByRole('button',{name:'Try an example'}));
  expect(screen.getByRole('spinbutton',{name:'Customers per day'})).toHaveProperty('value','65');
  await fireEvent.click(screen.getByRole('button',{name:'10 more customers per day'}));
  expect(screen.getByRole('spinbutton',{name:'Customers per day'})).toHaveProperty('value','75');
  expect(screen.getByRole('status').textContent).toContain('35,100');
  await route('explore');await route('reports');
  await fireEvent.click(screen.getByRole('button',{name:'Use my numbers'}));
  expect(screen.getByRole('spinbutton',{name:'Customers per day'})).toHaveProperty('value','40');
  await fireEvent.click(screen.getByRole('button',{name:'Download sample PDF'}));
  expect(downloadReport).toHaveBeenCalledWith(expect.objectContaining({id:'ss15'}),'en',{customers:40,basket:20,days:25,margin:60,fixed:15000});
 });
 it('pauses results and PDF for cleared or invalid inputs while accepting zero costs',async()=>{
  render(App);await route('reports');await screen.findByRole('heading',{name:'What would it take to break even?'});
  const fixed=screen.getByRole('spinbutton',{name:'Monthly fixed costs (RM)'});
  await fireEvent.input(fixed,{target:{value:''}});
  expect(screen.getByRole('button',{name:'Download sample PDF'})).toHaveProperty('disabled',true);
  expect(screen.queryByText('RM 30,420')).toBeNull();
  await fireEvent.input(fixed,{target:{value:'0'}});
  expect(screen.getByRole('button',{name:'Download sample PDF'})).toHaveProperty('disabled',false);
  const days=screen.getByRole('spinbutton',{name:'Open days / month'});
  await fireEvent.input(days,{target:{value:'32'}});
  expect(screen.getByRole('button',{name:'Download sample PDF'})).toHaveProperty('disabled',true);
  expect(screen.getByText('Check your estimates')).toBeTruthy();
 });
 it('does not assign the viewed sample to a request for another location',async()=>{
  render(App);await fireEvent.click(await screen.findByRole('button',{name:'TTDI Kuala Lumpur'}));
  await fireEvent.click(screen.getByRole('button',{name:'Request a report for this area'}));
  expect(await screen.findByLabelText(/Location \/ address/)).toHaveProperty('value','TTDI');
  await route('explore');await fireEvent.click(screen.getByRole('link',{name:'Request another location'}));
  expect(await screen.findByLabelText(/Location \/ address/)).toHaveProperty('value','');
 });
 it('switches calculator language without losing personal estimates',async()=>{
  render(App);await route('reports');await fireEvent.click(await screen.findByRole('button',{name:'Use my numbers'}));
  await fireEvent.input(screen.getByRole('spinbutton',{name:'Customers per day'}),{target:{value:'88'}});
  await fireEvent.click(screen.getByRole('button',{name:'Switch to Bahasa Malaysia'}));
  expect(screen.getByRole('button',{name:'Guna angka saya'}).getAttribute('aria-pressed')).toBe('true');
  expect(screen.getByRole('spinbutton',{name:'Pelanggan sehari'})).toHaveProperty('value','88');
  expect(screen.getByRole('button',{name:'Muat turun PDF contoh'})).toHaveProperty('disabled',true);
 });
});

