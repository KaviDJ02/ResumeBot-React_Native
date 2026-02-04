import React, { useState } from 'react';
import { Alert, Pressable, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';

import { auth } from '@/firebase';

function PrimaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="rounded bg-black px-4 py-3 active:opacity-80">
      <Text className="text-center font-semibold text-white">{title}</Text>
    </Pressable>
  );
}

function DestructiveButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="rounded bg-red-600 px-4 py-3 active:opacity-80">
      <Text className="text-center font-semibold text-white">{title}</Text>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      <View className="px-5 pb-4 pt-2">
        <Text className="text-2xl font-semibold">Profile</Text>
      </View>

      <View className="flex-1 px-5">
        <View className="flex-1">
          <Text className="mb-4 text-base text-gray-700">Manage your account and CV data.</Text>

          <PrimaryButton title="CV Data" onPress={() => router.push('/(tabs)/cv-data')} />
        </View>

        <View className="pb-4">
          <DestructiveButton
            title={loggingOut ? 'Logging out…' : 'Log Out'}
            onPress={() => {
              if (loggingOut) return;
              Alert.alert('Log out?', 'You will be returned to the welcome screen.', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Log Out',
                  style: 'destructive',
                  onPress: async () => {
                    setLoggingOut(true);
                    try {
                      await signOut(auth);
                    } catch {
                      // Ignore sign-out errors and still route to auth.
                    } finally {
                      setLoggingOut(false);
                      router.replace('/(auth)/welcome');
                    }
                  },
                },
              ]);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
