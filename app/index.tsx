import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  const bypassAuth = false;
    // String(process.env.EXPO_PUBLIC_BYPASS_AUTH || '').toLowerCase() === 'true' ||
    // String(process.env.EXPO_PUBLIC_BYPASS_AUTH || '') === '1';

  return <Redirect href={bypassAuth ? '/(tabs)/home' : '/(auth)/welcome'} />;
}
