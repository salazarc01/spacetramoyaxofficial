
export enum AppView {
  HOME = 'HOME',
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_PANEL = 'ADMIN_PANEL',
  DASHBOARD = 'DASHBOARD',
  SPACEBANK = 'SPACEBANK',
  NOTIFICATIONS = 'NOTIFICATIONS',
  PROFILE = 'PROFILE'
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'credit' | 'sent' | 'received' | 'tax';
  amount: number;
  reference: string;
  targetUserId?: string;
  senderName?: string;
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
  savingsBalance: number; // Nueva cuenta de ahorro
  status: 'pending' | 'active' | 'blocked';
  createdAt: string;
  hasSeenWelcomeCredit?: boolean;
  lastTaxMonth?: string; // Para controlar el cobro mensual
}
