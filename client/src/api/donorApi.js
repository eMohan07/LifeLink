import axiosClient from './axiosClient';

export const donorApi = {
  getProfile: () => axiosClient.get('/donors/profile'),
  updateProfile: (data) => axiosClient.put('/donors/profile', data),
  searchDonors: (params) => axiosClient.get('/donors/search', { params }),
  getAllDonors: () => axiosClient.get('/donors/all'),
};
