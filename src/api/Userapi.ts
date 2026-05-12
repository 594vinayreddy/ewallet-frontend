import axiosClient from './axiosClient';

// ── Types ──────────────────────────────────────────────────────────────────

export interface UserProfile {
id: number;
firstName: string;
lastName: string;
email: string;
phoneNumber: string;
dateOfBirth: string;
}

// ── Endpoints ──────────────────────────────────────────────────────────────

// GET /users/profile  →  UserController.getUser()
// Backend reads userId from the "X-User-Id" header.
// Your API Gateway should inject this header from the JWT token.
// If not yet configured, pass it manually here:
export const getProfile = (userId: number) =>
axiosClient.get<UserProfile>('/users/profile', {
headers: { 'X-User-Id': userId },
});

// DELETE /users/profile  →  UserController.deleteUser()
export const deleteProfile = (userId: number) =>
axiosClient.delete('/users/profile', {
    headers: { 'X-User-Id': userId },
  });