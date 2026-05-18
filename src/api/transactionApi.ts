import axiosClient from './axiosClient';

// ── Types ──────────────────────────────────────────────────────────────────

export interface TransferRequest {
senderEmail: string;
receiverEmail: string;
amount: number;
description: string;
pin: string;
}

export interface Transaction {
id: string;
senderEmail: string;
receiverEmail: string;
amount: number;
description?: string;
status: 'SUCCESS' | 'FAILED' | 'PENDING';
createdAt: string;
}

// ── API Calls ──────────────────────────────────────────────────────────────

export const transfer = async (
data: TransferRequest
) => {

try {

const response = await axiosClient.post<Transaction>(
'/transactions/transfer',
data
);

return response.data;

} catch (error) {

console.error('Transfer API Error:', error);

    throw error;
  }
};

export const getTransactionHistory = async (
  email: string
) => {

  try {

    const response = await axiosClient.get<Transaction[]>(
      `/transactions/history/${email}`
    );

    return response.data;

  } catch (error) {

    console.error('Transaction History API Error:', error);

    throw error;
  }
};