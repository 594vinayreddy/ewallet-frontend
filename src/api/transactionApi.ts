// src/api/transactionApi.ts
import axiosClient from './axiosClient';

export const getTransactions = () =>
axiosClient.get('/transactions');

export const transfer = (payload: { from: string; to: string; amount: number }) =>
  axiosClient.post('/transactions/transfer', payload);