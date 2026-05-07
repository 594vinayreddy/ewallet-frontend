// src/api/walletApi.ts
import axiosClient from './axiosClient';

export const getBalance = (userId: string) =>
  axiosClient.get(`/wallet/${userId}/balance`);

export const getWalletHistory = (userId: string) =>
  axiosClient.get(`/wallet/${userId}/history`);