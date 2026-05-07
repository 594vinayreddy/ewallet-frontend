// src/types/index.ts

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
}

export interface ServiceHealth {
  name: string;
  port: number;
  status: 'UP' | 'DOWN' | 'UNKNOWN';
}