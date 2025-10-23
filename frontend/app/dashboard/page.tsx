'use client';

import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboardService';
import { DashboardStats } from '@/types';
import { Users, Package, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Dashboard stats yüklenirken hata:', error);
      setError('İstatistikler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="text-gray-600">{error}</p>
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Hoş geldiniz! İşte genel bakış.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.overview.totalUsers || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Ürün</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.overview.totalProducts || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Ürün</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.overview.activeProducts || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Düşük Stok</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.overview.lowStockProducts || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Son Kullanıcılar</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats?.recent.users.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Son Ürünler</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats?.recent.products.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">Stok: {product.stock}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {product.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
