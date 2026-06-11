import api from './api';
import { Promotion } from '../types';

export const getPromotions = async (branchId: string): Promise<Promotion[]> => {
  const { data } = await api.get(`/api/v1/panel/branches/${branchId}/promotions`);
  return data;
};

export const createPromotion = async (branchId: string, promoData: any): Promise<Promotion> => {
  const { data } = await api.post(`/api/v1/panel/branches/${branchId}/promotions`, promoData);
  return data;
};

export const updatePromotion = async (branchId: string, id: string, promoData: any): Promise<Promotion> => {
  const { data } = await api.patch(`/api/v1/panel/branches/${branchId}/promotions/${id}`, promoData);
  return data;
};
