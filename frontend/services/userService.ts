import api from '@/lib/api';
import { User } from '@/types';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data.users;
  },

  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    role?: 'admin' | 'user';
  }): Promise<User> {
    const response = await api.post('/users', userData);
    return response.data.user;
  },

  async getUserProfile(userId: number): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    return response.data.user;
  },

  async updateUserRole(userId: number, role: 'admin' | 'user'): Promise<User> {
    const response = await api.put(`/users/${userId}`, { role });
    return response.data.user;
  },

  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
  },
};
