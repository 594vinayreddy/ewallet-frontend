import axiosClient from './axiosClient';

// ── Types ──────────────────────────────────────────────────────────────────

export interface TransferRequest {
senderUserId: number;
receiverUserId: number;
amount: number;
description: string;
}

export interface Transaction {
id: string;
senderUserId: number;
receiverUserId: number;
amount: number;
description?: string;
status: 'SUCCESS' | 'FAILED' | 'PENDING';
createdAt: string;
}

// ── API Calls ──────────────────────────────────────────────────────────────

// POST /transactions/transfer
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

// GET /transactions/history/{userId}
export const getTransactionHistory = async (
  userId: number
) => {

  try {

    const response = await axiosClient.get<Transaction[]>(
      `/transactions/history/${userId}`
    );

    return response.data;

  } catch (error) {

    console.error('Transaction History API Error:', error);

    throw error;
  }
};