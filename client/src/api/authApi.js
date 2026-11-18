import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  register: (userData) => axiosClient.post('/auth/register', userData),
  loginWithGoogle: (payload) =>
    axiosClient.post('/auth/google', payload, {
      timeout: 15000, // Enforce 15-second timeout on Google auth
      skipToast: true, // Handle errors inline to avoid duplicate toasts
    }),
  getMe: () => axiosClient.get('/auth/me'),
};

export default authApi;
