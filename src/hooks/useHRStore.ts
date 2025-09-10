import { create } from 'zustand';

type Employee = {
  id: string;
  name: string;
  role: string;
  level: 'Jr' | 'Mid' | 'Sr';
  cost: number;
};

type Program = {
  id: string;
  name: string;
  status: 'geplant' | 'aktiv' | 'abgeschlossen';
};

type HRState = {
  employees: Employee[];
  programs: Program[];
  budget: number;
  hire: () => void;
  launchProgram: (name: string) => void;
  setBudget: (n: number) => void;
};

export const useHRStore = create<HRState>((set, get) => ({
  employees: [],
  programs: [],
  budget: 500000,
  hire: () => {
    const next: Employee = {
      id: crypto.randomUUID(),
      name: `Mitarbeiter ${get().employees.length + 1}`,
      role: 'Cabin Crew',
      level: 'Jr',
      cost: 3500
    };
    set(state => ({ employees: [...state.employees, next] }));
  },
  launchProgram: (name: string) => {
    const p: Program = { id: crypto.randomUUID(), name, status: 'aktiv' };
    set(state => ({ programs: [...state.programs, p] }));
  },
  setBudget: (n: number) => set({ budget: n })
}));
