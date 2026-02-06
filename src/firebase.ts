import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

const app = initializeApp(firebaseConfig);

function createAuth() {
  // On web, prefer the default web auth implementation.
  if (Platform.OS === 'web') return getAuth(app);

  // In React Native, configure persistence using AsyncStorage.
  // Use a conditional require so web bundling doesn't trip over native modules.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;

  const getReactNativePersistence = (FirebaseAuth as any).getReactNativePersistence as
    | ((storage: unknown) => unknown)
    | undefined;
  if (typeof getReactNativePersistence !== 'function') {
    // If the RN persistence helper isn't available in this build, fall back.
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage) as any,
    });
  } catch {
    // If auth was already initialized (fast refresh / reload), fall back.
    return getAuth(app);
  }
}

export const auth = createAuth();
export const db = getFirestore(app);
