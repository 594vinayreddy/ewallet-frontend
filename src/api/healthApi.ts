// src/api/healthApi.ts
import axiosClient from './axiosClient';

export const getHealth = () => axiosClient.get('/actuator/health');