import api from './api';

export const getSettings = async (branchId: string): Promise<any> => {
  const { data } = await api.get(`/api/v1/panel/branches/${branchId}/settings`);
  return data;
};

export const updateSettings = async (branchId: string, settingsData: any): Promise<any> => {
  const { data } = await api.patch(`/api/v1/panel/branches/${branchId}/settings`, settingsData);
  return data;
};
