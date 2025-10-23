# Ürün Yönetim Portalı

Modern ve güvenli bir full-stack ürün yönetim sistemi. Kullanıcı rolleri ile yetkilendirme, CRUD operasyonları ve dashboard özellikleri içerir.

## Özellikler

- **Kullanıcı Kimlik Doğrulama** - JWT tabanlı güvenli giriş sistemi
- **Rol Bazlı Yetkilendirme** - Admin ve User rolleri
- **Ürün Yönetimi** - Ürün ekleme, düzenleme, silme ve listeleme
- **Kullanıcı Yönetimi** - Admin panelinde kullanıcı yönetimi (sadece admin)
- **Dashboard** - İstatistikler ve genel bakış
- **Responsive Tasarım** - Mobil uyumlu modern arayüz
- **Real-time Validasyon** - Form doğrulama ve hata yönetimi

## Teknoloji Stack'i

### Frontend
- **[Next.js 15.5.6](https://nextjs.org/)** - React framework (App Router)
- **[React 19.1.0](https://react.dev/)** - UI kütüphanesi
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS v3](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Axios](https://axios-http.com/)** - HTTP client
- **[React Hot Toast](https://react-hot-toast.com/)** - Bildirimler
- **[Lucide React](https://lucide.dev/)** - İkon seti

### Backend
- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[Express.js](https://expressjs.com/)** - Web framework
- **[Prisma ORM](https://www.prisma.io/)** - Database ORM
- **[PostgreSQL](https://www.postgresql.org/)** - İlişkisel veritabanı
- **[JWT](https://jwt.io/)** - Token-based authentication
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Şifre hashleme

## Proje Yapısı

```
urun-yonetim-portali/
├── backend/
│   ├── controllers/        # İş mantığı
│   ├── middleware/         # Auth & Role middleware
│   ├── prisma/            # Database schema & migrations
│   ├── routes/            # API route'ları
│   └── index.js           # Express server
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/        # Login & Register sayfaları
│   │   ├── dashboard/     # Dashboard sayfaları
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Ana sayfa
│   ├── components/        # React componentleri
│   ├── context/           # React Context (Auth)
│   ├── lib/               # Utility fonksiyonlar
│   ├── services/          # API servisleri
│   └── types/             # TypeScript tipleri
│
└── README.md
```

## Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL
- npm veya yarn

### 1. Repository'yi Klonlayın
```bash
git clone <repo-url>
cd urun-yonetim-portali
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

`.env` dosyası oluşturun:
```env
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/veritabani"
JWT_SECRET="your-secret-key-here"
PORT=8001
```

Veritabanı migration'ları çalıştırın:
```bash
npx prisma migrate dev
```

Backend'i başlatın:
```bash
npm start
```

### 3. Frontend Kurulumu

```bash
cd frontend
npm install
```

`.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_API_URL=http://localhost:8001/api
```

Frontend'i başlatın:
```bash
npm run dev
```

## Kullanım

### İlk Kullanıcı Oluşturma

1. `http://localhost:3000/register` adresine gidin
2. Formu doldurun ve "Admin" rolünü seçin
3. Kayıt olduktan sonra otomatik giriş yapılır

### Admin Özellikleri
- Tüm kullanıcıları görüntüleme
- Kullanıcı rollerini değiştirme
- Kullanıcıları silme
- Tüm ürünleri görüntüleme ve yönetme

### User Özellikleri
- Sadece kendi ürünlerini görüntüleme
- Ürün ekleme, düzenleme ve silme
- Dashboard istatistiklerini görme

## API Endpoints

### Authentication
```
POST   /api/auth/register    # Yeni kullanıcı kaydı
POST   /api/auth/login        # Kullanıcı girişi
```

### Users (Admin Only)
```
GET    /api/users             # Tüm kullanıcıları listele
GET    /api/users/:id         # Kullanıcı detayı
PUT    /api/users/:id         # Kullanıcı rolü güncelle
DELETE /api/users/:id         # Kullanıcı sil
```

### Products
```
GET    /api/products          # Ürünleri listele
POST   /api/products          # Yeni ürün ekle
PUT    /api/products/:id      # Ürün güncelle
DELETE /api/products/:id      # Ürün sil
```

### Dashboard
```
GET    /api/dashboard         # Dashboard istatistikleri
```

## Güvenlik

- JWT token-based authentication
- Bcrypt ile şifre hashleme
- Role-based access control (RBAC)
- Protected routes (frontend & backend)
- CORS yapılandırması
- HTTP-only token storage

## UI/UX Özellikleri

- Modern ve temiz tasarım
- Responsive layout (mobile-first)
- Loading states
- Error handling
- Toast notifications
- Form validation
- Empty states
- Interactive tables

## Veritabanı Şeması

### User Model
```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String?   @unique
  name      String?
  password  String?
  role      Role      @default(user)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  product   Product[]
}
```

### Product Model
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  priceCents  Int      @default(0)
  stock       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  ownerId     Int
  owner       User     @relation(fields: [ownerId], references: [id])
}
```

## Geliştirme Notları

### Environment Variables
- Backend: `.env` (git'e eklenmez)
- Frontend: `.env.local` (git'e eklenmez)

### Port Yapılandırması
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8001`

### Database Migration
```bash
# Yeni migration oluştur
npx prisma migrate dev --name migration-adi

# Prisma Studio'yu aç (DB GUI)
npx prisma studio
```

## Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit'leyin (`git commit -m 'feat: Add amazing feature'`)
4. Push'layın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## Geliştirici

Halil İbrahim Kamay

## Teşekkürler

Bu proje modern web geliştirme teknolojilerini öğrenmek ve pratik yapmak için geliştirilmiştir.

---

**Not:** Production ortamında kullanmadan önce environment variable'ları ve güvenlik ayarlarını mutlaka güncelleyin!
