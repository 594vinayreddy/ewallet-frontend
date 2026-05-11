// src/api/transactionApi.ts
import axiosClient from './axiosClient';

export interface TransferRequest {
  receiverId: string;
  amount: number;
  description: string;
}

export const transfer = (data: TransferRequest) =>
  axiosClient.post('/transaction/transfer', data);