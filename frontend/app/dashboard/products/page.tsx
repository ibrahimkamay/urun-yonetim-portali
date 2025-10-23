'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { Loader2, Package, Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    isActive: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      toast.error('Ürünler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: (product.priceCents / 100).toFixed(2),
        stock: product.stock.toString(),
        isActive: product.isActive,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      description: formData.description,
      priceCents: Math.round(parseFloat(formData.price) * 100),
      stock: parseInt(formData.stock),
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        toast.success('Ürün güncellendi');
      } else {
        await productService.createProduct(productData);
        toast.success('Ürün oluşturuldu');
      }
      handleCloseModal();
      loadProducts();
    } catch (error) {
      console.error('Ürün kaydedilirken hata:', error);
      toast.error('Ürün kaydedilemedi');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await productService.deleteProduct(id);
      toast.success('Ürün silindi');
      loadProducts();
    } catch (error) {
      console.error('Ürün silinirken hata:', error);
      toast.error('Ürün silinemedi');
    }
  };

  const canEditProduct = (product: Product) => {
    return isAdmin || product.ownerId === user?.id;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Tüm ürünleri görüntüleyin ve yönetin.' : 'Ürünlerinizi görüntüleyin ve yönetin.'}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Ürün</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="ml-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Fiyat:</span>
                  <span className="font-semibold text-gray-900">
                    ₺{(product.priceCents / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Stok:</span>
                  <span
                    className={`font-semibold ${
                      product.stock < 10 ? 'text-red-600' : 'text-gray-900'
                    }`}
                  >
                    {product.stock}
                  </span>
                </div>
              </div>

              {canEditProduct(product) && (
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Düzenle</span>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Sil</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Henüz ürün bulunmuyor.</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            İlk ürününüzü ekleyin
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Aktif Ürün
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingProduct ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
