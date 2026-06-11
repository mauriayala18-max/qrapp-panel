import api from './api';
import { DashboardStats } from '../types';

export const getDashboard = async (branchId: string): Promise<DashboardStats> => {
  const { data } = await api.get(`/api/v1/panel/branches/${branchId}/dashboard`);
  return data;
};
