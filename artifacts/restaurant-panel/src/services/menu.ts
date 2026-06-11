import api from './api';
import { MenuItem } from '../types';

export const getMenu = async (branchId: string): Promise<MenuItem[]> => {
  const { data } = await api.get(`/api/v1/panel/branches/${branchId}/menu`);
  return data;
};

export const createMenuItem = async (branchId: string, itemData: any): Promise<MenuItem> => {
  const { data } = await api.post(`/api/v1/panel/branches/${branchId}/menu`, itemData);
  return data;
};

export const updateMenuItem = async (branchId: string, itemId: string, itemData: any): Promise<MenuItem> => {
  const { data } = await api.patch(`/api/v1/panel/branches/${branchId}/menu/${itemId}`, itemData);
  return data;
};

export const deleteMenuItem = async (branchId: string, itemId: string): Promise<void> => {
  const { data } = await api.delete(`/api/v1/panel/branches/${branchId}/menu/${itemId}`);
  return data;
};
