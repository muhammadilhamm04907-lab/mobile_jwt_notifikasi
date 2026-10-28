import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function AppLayout() {
  useEffect(() => {
    let received;
    let response;
    try {
      if (Notifications.addNotificationReceivedListener) {
        received = Notifications.addNotificationReceivedListener(
          (notification) => {
            console.log('Notifikasi diterima:', notification.request.content);
          }
        );
      }

      if (Notifications.addNotificationResponseReceivedListener) {
        response = Notifications.addNotificationResponseReceivedListener(
          (event) => {
            const screen = event.notification.request.content.data?.screen;
            if (screen === 'profile') {
              router.push('/profile');
            }
          }
        );
      }
    } catch (err) {
      console.warn('Notification listener error:', err.message);
    }

    return () => {
      received?.remove?.();
      response?.remove?.();
    };
  }, []);

  return <Stack />;
}
