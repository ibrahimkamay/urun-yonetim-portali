'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import { User } from '@/types';
import { Loader2, User as UserIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }
    loadUsers();
  }, [isAdmin, router]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
      toast.error('Kullanıcılar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: 'user' | 'admin') => {
    try {
      await userService.updateUserRole(userId, newRole);
      toast.success('Kullanıcı rolü güncellendi');
      loadUsers();
    } catch (error) {
      console.error('Rol güncellenirken hata:', error);
      toast.error('Rol güncellenemedi');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      toast.success('Kullanıcı silindi');
      loadUsers();
    } catch (error) {
      console.error('Kullanıcı silinirken hata:', error);
      toast.error('Kullanıcı silinemedi');
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-1">Tüm kullanıcıları görüntüleyin ve yönetin.</p>
        </div>
        <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
          Toplam: {users.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="font-medium text-gray-900">{u.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as 'user' | 'admin')}
                      disabled={u.id === user?.id}
                      className={`px-3 py-1 text-sm font-medium rounded-full border-0 ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      } ${u.id === user?.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <option value="user">Kullanıcı</option>
                      <option value="admin">Yönetici</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={u.id === user?.id}
                      className={`text-red-600 hover:text-red-800 transition ${
                        u.id === user?.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title={u.id === user?.id ? 'Kendi hesabınızı silemezsiniz' : 'Kullanıcıyı sil'}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Henüz kullanıcı bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
