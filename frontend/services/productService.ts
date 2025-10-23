import api from '@/lib/api';
import { Product, ProductFormData } from '@/types';

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data.products;
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    const response = await api.post('/products', data);
    return response.data.product;
  },

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
    const response = await api.put(`/products/${id}`, data);
    return response.data.updateProduct;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
