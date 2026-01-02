
export enum AppView {
  HOME = 'HOME',
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_PANEL = 'ADMIN_PANEL',
  SPACEBANK = 'SPACEBANK'
}

export interface Transaction {
  id: string; // Referencia de 20 números
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
  reason: string;
  date: string;
  type: 'transfer' | 'bonus' | 'credit';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  amount?: number;
  date: string;
  isBonus?: boolean;
  imageUrl?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  email: string;
  password?: string;
  balance: number;
  status: 'pending' | 'active';
  createdAt: string;
}
