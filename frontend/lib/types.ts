export enum BusType {
  SUPER_LUXURY = 'SUPER_LUXURY',
  LUXURY = 'LUXURY',
  SEMI_LUXURY = 'SEMI_LUXURY',
  NORMAL = 'NORMAL'
}

export const BusTypeLabels: Record<BusType, string> = {
  [BusType.SUPER_LUXURY] : 'Super Luxury',
  [BusType.LUXURY]: 'Luxury',
  [BusType.SEMI_LUXURY]: 'Semi Luxury',
  [BusType.NORMAL]: 'Normal',
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