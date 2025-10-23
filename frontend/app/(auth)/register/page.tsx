'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Gönderilen data:', formData);
      await authService.register(formData);
      toast.success('Kayıt başarılı!');
      setTimeout(() => router.push('/login'), 1000);
    } catch (error: any) {
      console.error('Kayıt hatası:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Kayıt başarısız!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-md">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Hesap Oluştur</h1>
          <p className="text-gray-600 mt-2">Yeni hesabınızı oluşturun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adınız Soyadınız"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="En az 6 karakter"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hesap Türü
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'user' })}
                className={`p-3 border-2 rounded-md ${
                  formData.role === 'user'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">Kullanıcı</div>
                <div className="text-xs mt-1">Standart erişim</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'admin' })}
                className={`p-3 border-2 rounded-md ${
                  formData.role === 'admin'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">Yönetici</div>
                <div className="text-xs mt-1">Tam erişim</div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Kayıt yapılıyor...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Kayıt Ol
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
