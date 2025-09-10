/**
 * Defines interfaces for common types used across the simulator.  
 */

export interface UserConfig {
  airlineName: string;
  ceoName: string;
  colors: {
    primary: string;
    secondary: string;
  };
  logo?: string;
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