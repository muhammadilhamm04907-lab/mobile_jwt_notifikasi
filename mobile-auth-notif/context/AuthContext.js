import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getMe, loginUser } from '../services/authService';

const AuthContext = createContext(null);
const TOKEN_KEY = 'access_token';

async function setStorageItem(key, value) {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage error:', e);
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getStorageItem(key) {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function deleteStorageItem(key) {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage error:', e);
    }
    return;
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (e) {
    console.warn('SecureStore delete error:', e);
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const saved = await getStorageItem(TOKEN_KEY);
      if (!saved) return;
      const me = await getMe(saved);
      setToken(saved);
      setUser(me);
    } catch {
      await deleteStorageItem(TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    const data = await loginUser(email, password);
    await setStorageItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function signOut() {
    await deleteStorageItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, user, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
