import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { createPlacePopup, distanceFromStudyPoint, safeWebsite } from '../src/lib/place-details';
import type { Area, Place } from '../src/lib/model';
const areas: Area[] = JSON.parse(fs.readFileSync('public/data/locations.json', 'utf8'));
const area = areas[0];
const sinbad = area.elements.find(p => p.tags.name === 'Sinbad')!;
describe('mapped place details', () => {
 it('adds honest context to sparse Sinbad data without inventing details', () => {
  const popup = createPlacePopup(sinbad, area, 'en');
  expect(popup.textContent).toContain('F&B · Restaurant');
  expect(popup.textContent).toContain('SS15');
  expect(popup.textContent).toContain('straight line');
  expect(popup.textContent).toContain('not listed in this snapshot');
  expect(popup.querySelectorAll('a')).toHaveLength(1);
  expect(popup.querySelector('a')?.href).toBe('https://www.openstreetmap.org/node/1761225094');
 });
 it('renders available address, hours, phone and website with BM labels', () => {
  const place = area.elements.find(p => p.tags.name === '7-Eleven' && p.tags.opening_hours === '24/7')!;
  const popup = createPlacePopup(place, area, 'ms');
  expect(popup.textContent).toContain('Kedai serbaneka');
  expect(popup.textContent).toContain('Jalan SS12/1B');
  expect(popup.textContent).toContain('24 jam, setiap hari');
  expect(popup.querySelector('a[href^="tel:"]')?.getAttribute('href')).toBe('tel:+60321421136');
  expect(popup.querySelector('a[href="https://www.7eleven.com.my/"]')?.getAttribute('rel')).toBe('noopener noreferrer');
 });
 it('uses tag text safely and rejects unsafe links', () => {
  const place: Place = {...sinbad, tags:{...sinbad.tags,name:'<img src=x onerror=alert(1)>',website:'javascript:alert(1)',description:'<script>bad()</script>'}};
  const popup = createPlacePopup(place, area, 'en');
  expect(popup.querySelector('img,script')).toBeNull();
  expect(popup.textContent).toContain('<img src=x');
  expect(popup.querySelectorAll('a')).toHaveLength(1);
  expect(safeWebsite('data:text/html,test')).toBeNull();
  expect(safeWebsite('https://user:password@example.com')).toBeNull();
  expect(safeWebsite('www.example.com/about')).toBe('https://www.example.com/about');
 });
 it('calculates straight-line distance from the study point', () => {
  expect(distanceFromStudyPoint({...sinbad,lat:area.lat,lon:area.lon},area)).toBe(0);
  expect(distanceFromStudyPoint({...sinbad,lat:area.lat+.001,lon:area.lon},area)).toBeCloseTo(111.195,2);
 });
});
