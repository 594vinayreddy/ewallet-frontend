// src/api/walletApi.ts
import axiosClient from './axiosClient';

export const credit  = (amount: number) =>
  axiosClient.post(`/wallet/credit?amount=${amount}`);

export const debit   = (amount: number) =>
  axiosClient.post(`/wallet/debit?amount=${amount}`);

export const getBalance = (userId: string) =>
  axiosClient.get(`/wallet/${userId}/balance`);

export const getHistory = (userId: string, page = 0, size = 10) =>
  axiosClient.get(`/wallet/${userId}/history?page=${page}&size=${size}`);