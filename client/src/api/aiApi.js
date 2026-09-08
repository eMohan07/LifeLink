import axiosClient from './axiosClient';

export const aiApi = {
  getInsights: () => axiosClient.get('/ai/insights'),
  generateInsight: (prompt) => axiosClient.post('/ai/insights', { prompt }),
};
