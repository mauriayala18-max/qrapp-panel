import api from './api';
import { Employee } from '../types';

export const getEmployees = async (branchId: string): Promise<Employee[]> => {
  const { data } = await api.get(`/api/v1/panel/branches/${branchId}/employees`);
  return data;
};

export const createEmployee = async (branchId: string, empData: any): Promise<Employee> => {
  const { data } = await api.post(`/api/v1/panel/branches/${branchId}/employees`, empData);
  return data;
};

export const updateEmployee = async (branchId: string, id: string, empData: any): Promise<Employee> => {
  const { data } = await api.patch(`/api/v1/panel/branches/${branchId}/employees/${id}`, empData);
  return data;
};
