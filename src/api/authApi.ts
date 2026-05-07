
import axiosClient from './axiosClient';

export const login = (credentials: { username: string; password: string }) =>
axiosClient.post('/auth/login', credentials);

export const register = (data: { username: string; password: string }) =>
  axiosClient.post('/auth/register', data);