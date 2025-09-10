export interface UserConfig {
  airlineName: string;
  ceoName: string;
  colors: {
    primary: string;
    secondary: string;
  };
  logo?: string;

  /** Onboarding‑Optionen */
  financeMode?: 'real' | 'sandbox';
  timeMode?: 'real' | 'sandbox';
  timeScale?: 'normal' | 'fast' | 'top';
  fleetPreset?: 'none' | 'small' | 'medium' | 'large' | 'custom';
  customFleet?: Array<{ makerModel: string; count: number }>;
}

export type Status = 'ON_TIME' | 'DELAYED' | 'CANCELLED' | 'DIVERTED';

export interface Flight {
  num: string;
  route: string;
  dep: string;
  arr: string;
  status: Status;
  type: string;
}

export interface ActionProposal {
  id: string;
  flight: string;
  action: string;
  details: Record<string, unknown>;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
}
