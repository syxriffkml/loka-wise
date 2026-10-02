<script lang="ts">
 import {onMount} from 'svelte';
 import type {Area} from './model';
 import {category} from './model';
 import {createPlacePopup, placeName} from './place-details';
 import 'leaflet/dist/leaflet.css';
 let {area,filter='all',lang='en'}:{area:Area;filter?:string;lang?:'en'|'ms'}=$props();
 let el:HTMLDivElement;let map:any;let L:any;let group:any;let ready=$state(false);let tileFailed=$state(false);
 const symbols = {
  food:'<path d="M11 8v5m3-5v5m-6-5v5c0 3 6 3 6 0m-3 2v7m10-14c-4 0-4 9 0 9v5m0-14v9"/>',
  retail:'<path d="M9 12h14l-1 11H10Zm4 0V9a3 3 0 0 1 6 0v3"/>',
  transport:'<rect x="10" y="7" width="12" height="15" rx="3"/><path d="M10 14h12m-9 9-2 3m8-3 2 3M14 18h.1m4 0h.1"/>',
  parking:'<path d="M13 24V9h5a4 4 0 0 1 0 8h-5"/>'
 };
 const colors = {food:'#9b6d22',retail:'#123d5b',transport:'#207669',parking:'#56667d'};
 function pinIcon(kind:keyof typeof colors){
  return L.divIcon({className:`place-pin pin-${kind}`,iconSize:[30,39],iconAnchor:[15,38],popupAnchor:[0,-34],html:`<svg viewBox="0 0 32 42" aria-hidden="true"><path d="M16 40S2 25 2 16a14 14 0 0 1 28 0c0 9-14 24-14 24Z" fill="${colors[kind]}" stroke="#fffdf7" stroke-width="2"/><g fill="none" stroke="#fffdf7" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${symbols[kind]}</g></svg>`});
 }
 onMount(()=>{
  let active=true;
  import('leaflet').then(m=>{
   if(!active)return;L=m.default;map=L.map(el,{scrollWheelZoom:false}).setView([area.lat,area.lon],15);
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).on('tileerror',()=>tileFailed=true).addTo(map);
   group=L.layerGroup().addTo(map);ready=true;
  });
  return()=>{active=false;map?.remove();};
 });
 $effect(()=>{
  if(!ready||!area)return;
  const a=area, f=filter, language=lang;
  group.clearLayers();map.setView([a.lat,a.lon],15);
  L.circle([a.lat,a.lon],{radius:a.radius,color:'#b7832f',weight:2,fillOpacity:.04,dashArray:'5 7'}).addTo(group);
  const icons={food:pinIcon('food'),retail:pinIcon('retail'),transport:pinIcon('transport'),parking:pinIcon('parking')};
  a.elements.filter(p=>f==='all'||category(p)===f).forEach(p=>{
   if(!Number.isFinite(p.lat)||!Number.isFinite(p.lon))return;
   const name=placeName(p,language);
   const marker=L.marker([p.lat,p.lon],{icon:icons[category(p)],title:name,alt:name,keyboard:true,riseOnHover:true})
    .bindPopup(()=>createPlacePopup(p,a,language),{className:'place-popup',minWidth:180,maxWidth:290,maxHeight:220,autoPanPadding:[12,12],keepInView:true})
    .addTo(group);
   marker.getElement()?.setAttribute('aria-label',language==='en'?`View place: ${name}`:`Lihat tempat: ${name}`);
   marker.on('popupopen',()=>{
    marker.getElement()?.classList.add('pin-selected');
    const popup=marker.getPopup();
    popup.options.maxWidth=Math.max(160,Math.min(290,el.clientWidth-58));
    popup.options.minWidth=Math.min(220,popup.options.maxWidth);
    popup.options.maxHeight=Math.max(145,el.clientHeight-105);
    popup.update();
   });
   marker.on('popupclose',()=>marker.getElement()?.classList.remove('pin-selected'));
  });
 });
</script>
<div class="map-wrap"><div class="map" bind:this={el} aria-label={lang==='en'?'OpenStreetMap location map':'Peta lokasi OpenStreetMap'}></div>{#if tileFailed}<div class="map-notice">{lang==='en'?'Map background unavailable. Saved place data remains available in the report.':'Latar peta tidak tersedia. Data tempat tersimpan masih tersedia dalam laporan.'}</div>{/if}<div class="map-caption">800 m · OpenStreetMap</div></div>
