import api from './api';
import { Table } from '../types';

export const getTables = async (branchId: string): Promise<Table[]> => {
  const { data } = await api.get(`/api/v1/panel/branches/${branchId}/tables`);
  return data;
};

export const updateTableStatus = async (branchId: string, tableId: string, status: string): Promise<void> => {
  const { data } = await api.patch(`/api/v1/panel/branches/${branchId}/tables/${tableId}`, { status });
  return data;
};
