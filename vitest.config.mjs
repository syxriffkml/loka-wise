import {defineConfig} from 'vitest/config';
import {svelte} from '@sveltejs/vite-plugin-svelte';
export default defineConfig({plugins:[svelte()],resolve:{conditions:['browser']},test:{environment:'jsdom',include:['tests/ui.test.ts','tests/report.test.ts','tests/place-details.test.ts'],testTimeout:15000}});
