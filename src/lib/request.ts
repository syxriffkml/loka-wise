export interface RequestBrief {
  company: string;
  business: string;
  stage: string;
  budget: number | undefined;
  area: string;
  date: string;
  message: string;
  goal: 'locations' | 'report';
}

export const stages = [
  ['planning', 'Planning my first business', 'Merancang perniagaan pertama'],
  ['retirement', 'Starting or running a business after retirement', 'Memulakan atau mengurus perniagaan selepas bersara'],
  ['existing', 'Running an existing business', 'Mengurus perniagaan sedia ada'],
  ['relocating', 'Relocating my business', 'Memindahkan perniagaan saya'],
  ['expanding', 'Expanding to another outlet', 'Menambah cawangan perniagaan']
];
