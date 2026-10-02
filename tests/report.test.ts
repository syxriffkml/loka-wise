// @vitest-environment node
import {it,expect} from 'vitest';import fs from 'node:fs';import {createReport} from '../src/lib/report';
const area=JSON.parse(fs.readFileSync('public/data/locations.json','utf8'))[0];
it('creates a real PDF with source evidence and explicit forecast limits',()=>{const pdf=createReport(area,'en',{customers:65,basket:18,days:26,margin:65,fixed:16000});const content=pdf.output();expect(content.startsWith('%PDF')).toBe(true);expect(content).toContain('SS15');expect(content).toContain('OpenStreetMap');expect(content).toContain('not a demand forecast');expect(pdf.getNumberOfPages()).toBeLessThanOrEqual(3);});
it('creates the Bahasa Malaysia report',()=>{const content=createReport(area,'ms',{customers:65,basket:18,days:26,margin:65,fixed:16000}).output();expect(content).toContain('Laporan demonstrasi lokasi');expect(content).toContain('bukan ramalan permintaan');});
