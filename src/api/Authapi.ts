import axiosClient from './axiosClient';

// ── Types ──────────────────────────────────────────────────────────────────

export interface LoginRequest {
email: string;
password: string;
}

export interface RegisterRequest {
firstName: string;
lastName: string;
email: string;
password: string;
phoneNumber: string;   // BigDecimal on backend, sent as string over JSON
dateOfBirth: string;   // "YYYY-MM-DD"
}

export interface AuthResponse {
token: string;
}

// ── Endpoints ──────────────────────────────────────────────────────────────

// POST /auth/login  →  AuthController.login()
export const login = (data: LoginRequest) =>
axiosClient.post<AuthResponse>('/auth/login', data);

// POST /auth/register  →  AuthController.register()
export const register = (data: RegisterRequest) =>
axiosClient.post<AuthResponse>('/auth/register', data);

// PATCH /auth/update-password  →  AuthController.updatePassword()
export const updatePassword = (data: LoginRequest) =>
axiosClient.patch('/auth/update-password', data);