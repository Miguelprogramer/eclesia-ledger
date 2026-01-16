
export enum UserRole {
  PASTOR = 'PASTOR',
  DEACON = 'DIACONO'
}

export type ServiceType = 'DOMINGO' | 'TERCA' | 'QUARTA' | 'SEXTA' | 'SANTA_CEIA' | 'ESPECIAL';
export type PaymentMethod = 'PIX' | 'ESPECIE';

export interface TitheEntry {
  id: string;
  name: string;
  amount: number;
  method: PaymentMethod;
}

export interface ChurchReport {
  id: string;
  date: string;
  serviceType: ServiceType;
  deaconName: string;
  attendance: number;
  visitors: number;
  titheEntries: TitheEntry[];
  tithes: number;
  offeringsPix: number;
  offeringsCash: number;
  offerings: number;
  total: number;
  notes?: string;
  timestamp: number;
}

export interface ChurchSettings {
  churchName: string;
  monthlyGoal: number;
}

export interface User {
  id?: number;
  name: string;
  role: UserRole;
}
