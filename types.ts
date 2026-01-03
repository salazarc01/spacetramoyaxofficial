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
  type?: 'credit' | 'sent' | 'received';
  amount?: number;
  reference?: string;
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
  hasSeenWelcomeCredit?: boolean;
}