import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { getLoggedIn } from '../const'; // You'll need to create this hook

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {

    if (!getLoggedIn()) {
      router.replace('/login');
    } else if (getLoggedIn()) {
      router.replace('/');
    }
  }, [getLoggedIn()]);

  return <Slot />;
}