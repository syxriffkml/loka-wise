import { scenario } from './model';

export type ScenarioInputs = {
  customers: number | undefined;
  basket: number | undefined;
  days: number | undefined;
  margin: number | undefined;
  fixed: number | undefined;
};
export const exampleInputs = (): ScenarioInputs => ({ customers: 65, basket: 18, days: 26, margin: 65, fixed: 16000 });
export const emptyInputs = (): ScenarioInputs => ({ customers: undefined, basket: undefined, days: undefined, margin: undefined, fixed: undefined });
export function calculateInputs(input: ScenarioInputs) {
  if (Object.values(input).some(value => value === undefined || !Number.isFinite(value))) return null;
  if (input.days! < 1) return null;
  try { return scenario(input.customers!, input.basket!, input.days!, input.margin!, input.fixed!); }
  catch { return null; }
}
