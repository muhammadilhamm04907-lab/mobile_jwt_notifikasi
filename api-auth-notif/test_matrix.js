async function runMatrixTests() {
  const base = 'http://localhost:3000';
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  console.log('=== MEMULAI MATRIKS UJI WAJIB (BAGIAN E.2) ===\n');

  // Skenario 1: Register kosong -> 400
  let res = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nama: '', email: '', password: '' })
  });
  assert(res.status === 400, 'Skenario 1: Register kosong -> 400');

  // Skenario 2: Password < 8 karakter -> 400
  res = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nama: 'Budi Santoso', email: 'budi_uji@test.com', password: '123' })
  });
  assert(res.status === 400, 'Skenario 2: Password < 8 karakter -> 400');

  // Register user yang valid untuk pengujian
  res = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nama: 'Budi Santoso', email: 'budi_uji@test.com', password: 'password123' })
  });
  assert(res.status === 201, 'Setup: Register user valid berhasil (201)');

  // Skenario 3: Email duplikat -> 409
  res = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nama: 'Budi Santoso', email: 'budi_uji@test.com', password: 'password123' })
  });
  assert(res.status === 409, 'Skenario 3: Email duplikat -> 409');

  // Skenario 4: Login salah -> 401 tanpa bocorkan email/password
  res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'budi_uji@test.com', password: 'salah_password' })
  });
  const salahData = await res.json();
  assert(res.status === 401 && salahData.pesan === 'email atau password salah', 'Skenario 4: Login salah -> 401 (pesan generik)');

  // Login berhasil
  res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'budi_uji@test.com', password: 'password123' })
  });
  const authData = await res.json();
  const token = authData.token;
  assert(res.status === 200 && !!token, 'Setup: Login valid menghasilkan token JWT (200)');

  // Skenario 5: GET /auth/me tanpa token -> 401
  res = await fetch(`${base}/auth/me`);
  assert(res.status === 401, 'Skenario 5: GET /auth/me tanpa token -> 401');

  // Skenario 6: GET /auth/me token rusak -> 401
  res = await fetch(`${base}/auth/me`, {
    headers: { 'Authorization': 'Bearer token_rusak_palsu_123' }
  });
  assert(res.status === 401, 'Skenario 6: GET /auth/me token rusak -> 401');

  // Skenario 7: GET /auth/me token valid -> 200 + profil
  res = await fetch(`${base}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const profile = await res.json();
  assert(res.status === 200 && profile.email === 'budi_uji@test.com', 'Skenario 7: GET /auth/me token valid -> 200 + profil');

  // Skenario 10: Daftar push token tanpa JWT -> 401
  res = await fetch(`${base}/notifications/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expoPushToken: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' })
  });
  assert(res.status === 401, 'Skenario 10: Daftar push token tanpa JWT -> 401');

  // Skenario 11: Kirim push sebelum token terdaftar -> 404
  res = await fetch(`${base}/notifications/test`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert(res.status === 404, 'Skenario 11: Kirim push sebelum token terdaftar -> 404');

  // Simpan push token
  const dummyExpoToken = 'ExponentPushToken[mock_test_token_sample_12345]';
  res = await fetch(`${base}/notifications/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ expoPushToken: dummyExpoToken })
  });
  assert(res.status === 201, 'Setup: Daftarkan Expo Push Token berhasil (201)');

  // Skenario 12: Kirim push setelah token terdaftar -> Backend mendapat ticket dari push service
  res = await fetch(`${base}/notifications/test`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const notifResult = await res.json();
  // Expo push service returns { data: [{ status: 'error'/'ok', ... }] }
  assert(res.status === 200 && notifResult.pesan === 'notifikasi dikirim', 'Skenario 12: Kirim push setelah token terdaftar -> 200 & ticket diterima');

  console.log(`\nHASIL: ${passed} / ${total} skenario lulus sempurna!`);
}

runMatrixTests().catch(console.error);
