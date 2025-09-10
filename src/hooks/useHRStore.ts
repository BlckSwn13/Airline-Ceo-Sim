import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Employee = {
  id: string;
  name: string;
  role: string;
  level: 'Jr' | 'Mid' | 'Sr';
  cost: number;
  age?: number;
  position?: string;
};

type Program = {
  id: string;
  name: string;
  budget: number;
  active: boolean;
};

type HRState = {
  employees: Employee[];
  programs: Program[];
  budget: number;
  hire: (e: Omit<Employee, 'id'>) => void;
  addPerson: (name: string, role: string, age?: number, position?: string) => void;
  launchProgram: (p: Omit<Program, 'id' | 'active'>) => void;
  setBudget: (b: number) => void;
};

export const useHRStore = create<HRState>()(persist(
  (set) => ({
    employees: [],
    programs: [],
    budget: 1_000_000,
    hire: (e) => set(s => ({ employees: [...s.employees, { ...e, id: crypto.randomUUID() }] })),
    addPerson: (name, role, age, position) => set(s => ({
      employees: [
        ...s.employees,
        { id: crypto.randomUUID(), name, role, age, position, level: 'Sr', cost: 0 }
      ]
    })),
    launchProgram: (p) => set(s => ({ programs: [...s.programs, { ...p, id: crypto.randomUUID(), active: true }] })),
    setBudget: (b) => set(() => ({ budget: b })),
  }),
  { name: 'hr-store' }
));
