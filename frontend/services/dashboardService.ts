import api from '@/lib/api';
import { DashboardStats } from '@/types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard');
    return response.data.stats;
  },
};
