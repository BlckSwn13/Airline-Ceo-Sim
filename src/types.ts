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
