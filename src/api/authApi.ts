import axiosClient from './axiosClient';

// ── Login ──
export interface LoginRequest {
email: string;
password: string;
}

export interface AuthResponse {
token: string;
}

export const login = (credentials: LoginRequest) =>
axiosClient.post<AuthResponse>('/auth/login', credentials);

// ── Register ──
export interface RegisterRequest {
firstName: string;
lastName: string;
email: string;
password: string;
phoneNumber: string;   // sent as string; backend has BigDecimal but accepts string over JSON
dateOfBirth: string;   // "YYYY-MM-DD" — Java Date parses this fine
}

export const register = (data: RegisterRequest) =>
axiosClient.post<AuthResponse>('/auth/register', data);