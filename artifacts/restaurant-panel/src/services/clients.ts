import api from './api';
import { Client } from '../types';

export const getClients = async (branchId: string, search?: string): Promise<Client[]> => {
  const params = search ? { search } : {};
  const { data } = await api.get(`/api/v1/panel/branches/${branchId}/clients`, { params });
  return data;
};

export const getClient = async (branchId: string, clientId: string): Promise<Client> => {
  const { data } = await api.get(`/api/v1/panel/branches/${branchId}/clients/${clientId}`);
  return data;
};
