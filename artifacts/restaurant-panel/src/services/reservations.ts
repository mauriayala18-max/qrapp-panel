import api from './api';
import { Reservation } from '../types';

export const getReservations = async (branchId: string, date?: string): Promise<Reservation[]> => {
  const params = date ? { date } : {};
  const { data } = await api.get(`/api/v1/panel/branches/${branchId}/reservations`, { params });
  return data;
};

export const updateReservation = async (branchId: string, id: string, resData: any): Promise<Reservation> => {
  const { data } = await api.patch(`/api/v1/panel/branches/${branchId}/reservations/${id}`, resData);
  return data;
};
