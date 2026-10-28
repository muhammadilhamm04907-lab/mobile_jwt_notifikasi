# Mobile Auth & Push Notification (React Native Expo)

Aplikasi klien mobile yang mengimplementasikan autentikasi JWT, penyimpanan token aman dengan Expo SecureStore, protected routing dengan Expo Router, dan integrasi push notification dengan Expo Push Service & Firebase FCM.

## Fitur
- Register akun baru
- Login dengan JWT (access token)
- Penyimpanan token aman di hardware keychain/keystore via `expo-secure-store`
- Auto restore session saat aplikasi dibuka kembali
- Logout dan penghapusan token
- Navigasi terlindungi (`Stack.Protected`)
- Layar profil pengguna (mengambil data dari endpoint privat `GET /auth/me`)
- Registrasi Expo Push Token ke backend
- Menerima dan merespons push notification (background/foreground & deep link navigasi ke profil)

## Cara Menjalankan
1. Pastikan server backend (`api-auth-notif`) sudah berjalan.
2. Pastikan file `.env` sudah memuat alamat IP laptop/server:
   ```env
   EXPO_PUBLIC_API_URL=http://<IP_LAPTOP>:3000
   ```
3. Pasang dependensi jika belum:
   ```bash
   npm install
   ```
4. Jalankan Metro bundler:
   ```bash
   npx expo start
   ```
5. Buka menggunakan Expo Go (untuk fitur autentikasi) atau Development Build (untuk fitur remote push notification).
