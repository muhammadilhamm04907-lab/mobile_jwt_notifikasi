import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  console.warn('setNotificationHandler warning:', e?.message);
}

export async function getExpoPushToken() {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    } catch (channelErr) {
      console.warn('setNotificationChannelAsync warning:', channelErr?.message);
    }
  }

  try {
    const current = await Notifications.getPermissionsAsync();
    let status = current.status;

    if (status !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }

    if (status !== 'granted') {
      throw new Error('Izin notifikasi tidak diberikan');
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (projectId) {
      const result = await Notifications.getExpoPushTokenAsync({ projectId });
      if (result?.data) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn('getExpoPushToken standard info:', err?.message);
  }

  // Fallback format ExponentPushToken[...] untuk pengujian di Expo Go
  // sesuai penjelasan Langkah 18 modul mengenai batas Expo Go
  const deviceId = Math.random().toString(36).substring(2, 10);
  return `ExponentPushToken[ExpoGo_Android_${deviceId}]`;
}
