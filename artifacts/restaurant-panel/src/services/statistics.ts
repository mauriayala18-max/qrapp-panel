import api from './api';
import { Statistics } from '../types';

export const getStatistics = async (branchId: string, period?: string): Promise<Statistics> => {
  const params = period ? { period } : {};
  const { data } = await api.get(`/api/v1/panel/branches/${branchId}/statistics`, { params });
  return data;
};
