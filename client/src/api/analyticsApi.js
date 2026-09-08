import axiosClient from './axiosClient';

export const analyticsApi = {
  getSummary: () => axiosClient.get('/analytics/summary'),
  getHospitals: () => axiosClient.get('/hospitals/all'),
  updateHospitalInventory: (inventory) => axiosClient.put('/hospitals/inventory', { inventory }),
};
