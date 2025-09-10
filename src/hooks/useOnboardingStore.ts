import { create } from 'zustand';

export type FinanceMode = 'real' | 'sandbox';
export type TimeMode = 'real' | 'sandbox';
export type TimeScale = 'normal' | 'fast' | 'top';
export type FleetPreset = 'none' | 'small' | 'medium' | 'large' | 'custom';

export interface CustomFleetRow {
  makerModel: string;
  count: number;
}

interface OnboardingState {
  financeMode: FinanceMode;
  timeMode: TimeMode;
  timeScale: TimeScale;
  fleetPreset: FleetPreset;
  customFleet: CustomFleetRow[];
  setFinanceMode: (m: FinanceMode) => void;
  setTimeMode: (m: TimeMode) => void;
  setTimeScale: (s: TimeScale) => void;
  setFleetPreset: (p: FleetPreset) => void;
  setCustomFleet: (rows: CustomFleetRow[]) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  financeMode: 'real',
  timeMode: 'real',
  timeScale: 'normal',
  fleetPreset: 'none',
  customFleet: Array.from({ length: 5 }, () => ({ makerModel: '', count: 0 })),
  setFinanceMode: (m) => set({ financeMode: m }),
  setTimeMode: (m) => set({ timeMode: m }),
  setTimeScale: (s) => set({ timeScale: s }),
  setFleetPreset: (p) => set({ fleetPreset: p }),
  setCustomFleet: (rows) => set({ customFleet: rows }),
}));
