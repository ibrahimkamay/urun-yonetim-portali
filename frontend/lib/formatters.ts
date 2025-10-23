export const formatPrice = (priceCents: number): string => {
  const price = priceCents / 100;
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(price);
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Az önce';
  if (diffMins < 60) return `${diffMins} dakika önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 7) return `${diffDays} gün önce`;
  return formatDate(d);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('tr-TR').format(num);
};

export const translateRole = (role: 'admin' | 'user'): string => {
  return role === 'admin' ? 'Yönetici' : 'Kullanıcı';
};

export const getStockStatus = (stock: number): 'low' | 'medium' | 'high' => {
  if (stock < 10) return 'low';
  if (stock < 50) return 'medium';
  return 'high';
};
