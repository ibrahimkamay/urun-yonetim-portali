'use client';

import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Package, Users, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Portal', icon: LayoutDashboard, adminOnly: false },
    { href: '/dashboard/products', label: 'Ürünler', icon: Package, adminOnly: false },
    { href: '/dashboard/users', label: 'Kullanıcılar', icon: Users, adminOnly: true },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        
        <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
          <div className="flex items-center justify-between h-16 px-4">
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-xl font-bold text-gray-900">Ürün Yönetim Portalı</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={`
          fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-20
          transform transition-transform lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-64 pt-16">
          <div className="p-6">
            {children}
          </div>
        </main>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
