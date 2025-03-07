export enum BusType {
  LUXURY = 'LUXURY',
  SEMI_LUXURY = 'SEMI_LUXURY',
  EXPRESSWAY = 'EXPRESSWAY',
  AC = 'AC'
}

export const BusTypeLabels: Record<BusType, string> = {
  [BusType.LUXURY]: 'Luxury',
  [BusType.SEMI_LUXURY]: 'Semi Luxury',
  [BusType.EXPRESSWAY]: 'Expressway',
  [BusType.AC]: 'AC'
}

export interface Route {
  _id: string;
  number: string;
  name: string;
  busTypes: BusType[];
  locations?: Record<BusType, string[]>;
  fareMatrix?: Record<BusType, number[]>;
  lastUpdated: string;
}

export interface FareMatrix {
  [busType: string]: number[];
} 