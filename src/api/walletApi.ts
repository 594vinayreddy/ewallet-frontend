import axiosClient from './axiosClient';

// ── Types ──────────────────────────────────────────────────────────────────

export interface Wallet {
id: number;
userId: number;
email: string;
balance: number;
pin?: string;
}

export interface WalletTransactionDTO {
id: string;
type: 'CREDIT' | 'DEBIT' | 'TRANSFER';
amount: number;
description?: string;
date: string;
status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface SetPinRequest {
userId: number;
pin: string;
}

// ── Endpoints ──────────────────────────────────────────────────────────────

// GET /wallet/{userId}/history
export const getHistory = async (userId: number) => {
const response = await axiosClient.get<WalletTransactionDTO[]>(
`/wallet/${userId}/history`
);

return response.data;
};

// GET /wallet/{userId}
export const getWallet = async (userId: number) => {
const response = await axiosClient.get<Wallet>(
`/wallet/${userId}`
);

return response.data;
};

// GET /wallet/{userId}/balance
export const getBalance = async (userId: number) => {
const response = await axiosClient.get<number>(
`/wallet/${userId}/balance`
);

return response.data;
};

// POST /wallet/{userId}/credit?amount=
export const credit = async (
userId: number,
amount: number
) => {
const response = await axiosClient.post(
`/wallet/${userId}/credit`,
null,
{
params: {
amount,
},
}
);

return response.data;
};

// POST /wallet/{userId}/debit?amount=
export const debit = async (
userId: number,
amount: number
) => {
const response = await axiosClient.post(
`/wallet/${userId}/debit`,
null,
{
params: {
amount,
},
}
);

return response.data;
};

// POST /wallet/set-pin
export const setPin = async (
data: SetPinRequest
) => {
const response = await axiosClient.post(
`/wallet/set-pin`,
data
);

return response.data;
};