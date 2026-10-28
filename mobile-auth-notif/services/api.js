const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiFetch(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const data = res.status === 204 ? null : await res.json();

    if (!res.ok) {
      throw new Error(data?.pesan || 'Request gagal');
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(
        `Koneksi ke server timeout (${BASE_URL}). Pastikan backend berjalan dan IP laptop benar.`
      );
    }
    if (err.message.includes('Network request failed')) {
      throw new Error(
        `Gagal menghubungi server (${BASE_URL}). Pastikan backend menyala dan HP satu Wi-Fi dengan laptop.`
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
