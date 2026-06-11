import api from './api';
import { Order } from '../types';

export const getOrders = async (branchId: string, params?: any): Promise<Order[]> => {
  const { data } = await api.get(`/api/v1/panel/branches/${branchId}/orders`, { params });
  return data;
};

export const getOrder = async (branchId: string, orderId: string): Promise<Order> => {
  const { data } = await api.get(`/api/v1/panel/branches/${branchId}/orders/${orderId}`);
  return data;
};

export const updateOrderItemStatus = async (branchId: string, orderId: string, itemId: string, status: string): Promise<void> => {
  const { data } = await api.patch(`/api/v1/panel/branches/${branchId}/orders/${orderId}/items/${itemId}`, { status });
  return data;
};

export const markOrderReady = async (branchId: string, orderId: string): Promise<void> => {
  const { data } = await api.patch(`/api/v1/panel/branches/${branchId}/orders/${orderId}/ready`);
  return data;
};
