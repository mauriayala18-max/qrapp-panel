import api from './api';
import { Alert } from '../types';

export const getAlerts = async (branchId: string): Promise<Alert[]> => {
  const { data } = await api.get(`/api/v1/panel/branches/${branchId}/alerts`);
  return data;
};

export const resolveAlert = async (branchId: string, alertId: string): Promise<void> => {
  const { data } = await api.patch(`/api/v1/panel/branches/${branchId}/alerts/${alertId}/resolve`);
  return data;
};
