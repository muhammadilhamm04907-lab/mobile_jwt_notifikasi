# API Autentikasi JWT & Push Notification

Backend REST API menggunakan Express.js, MySQL, JSON Web Token (JWT), dan integrasi Expo Push Service.

## Persyaratan
- Node.js (v18+)
- MySQL / MariaDB (misal: XAMPP)

## Instalasi dan Setup
1. Instal dependensi:
   ```bash
   npm install
   ```
2. Buat database dan tabel:
   Import berkas `schema.sql` ke MySQL:
   ```bash
   mysql -u root -p < schema.sql
   ```
3. Konfigurasi file `.env`:
   Salin `.env.example` ke `.env` lalu sesuaikan kredensial basis data dan kunci rahasia JWT:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=db_mobile_auth
   JWT_SECRET=ganti_dengan_rahasia_panjang_acak
   JWT_EXPIRES_IN=1h
   ```

## Menjalankan Server
Mode pengembangan (dengan nodemon):
```bash
npm run dev
```

Mode produksi:
```bash
npm start
```

## Daftar Endpoint
| Method | Endpoint | Header Auth | Keterangan |
|---|---|---|---|
| GET | `/` | Tidak | Cek status server |
| POST | `/auth/register` | Tidak | Mendaftarkan akun baru |
| POST | `/auth/login` | Tidak | Login dan mendapatkan token JWT |
| GET | `/auth/me` | `Bearer <token>` | Mengambil profil user yang sedang login |
| POST | `/notifications/token` | `Bearer <token>` | Menyimpan Expo Push Token pengguna |
| POST | `/notifications/test` | `Bearer <token>` | Mengirim notifikasi push pengujian ke perangkat |
