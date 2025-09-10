// src/types.ts
export interface UserConfig {
  airlineName: string;
  ceoName: string;
  colors: { primary: string; secondary: string };
  settings: {
    financeMode: 'real' | 'sandbox';
    gameSpeed: 'real' | 'normal' | 'fast' | 'top';
  };
  fleet: { makerModel: string; count: number }[];
}

export interface Flight {
  id: string;
  callsign: string;
  origin: string;
  destination: string;
  std: string; // geplante Off-Block (ISO oder hh:mm)
  sta: string;
  status: 'ON TIME' | 'DELAYED' | 'BOARDING' | 'IN AIR' | 'CANCELLED';
  aircraftType: string;
  registration?: string;
}

export interface ChatMessage {
  author: string;
  content: string;
  ts?: number;
}

export interface FlightChatThread {
  flightId: string;
  messages: ChatMessage[];
}

// --------- Event-Feed ---------
export type EventCategory =
  | 'OPS'
  | 'SAFETY'
  | 'FINANCE'
  | 'HR'
  | 'IT'
  | 'CUSTOMER';

export interface EventItem {
  id: string;
  ts: number;            // epoch ms
  title: string;         // kurze Headline
  summary: string;       // 1-2 Sätze
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: EventCategory;
  meta?: Record<string, string>;
}
