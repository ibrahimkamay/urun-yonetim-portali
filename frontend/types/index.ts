export interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  role: 'admin' | 'user';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  owner?: {
    name: string;
    email: string;
  };
}

export interface DashboardStats {
  overview: {
    totalUsers: number;
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
  };
  recent: {
    users: User[];
    products: Product[];
  };
  charts: {
    usersByRole: {
      role: 'admin' | 'user';
      count: number;
    }[];
  };
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface ProductFormData {
  name: string;
  description?: string;
  priceCents: number;
  stock: number;
}
