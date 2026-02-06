import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';

import { auth } from '@/firebase';

function PrimaryButton({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded bg-black px-4 py-3 active:opacity-80 ${disabled ? 'opacity-60' : ''}`}>
      <Text className="text-center font-semibold text-white">{title}</Text>
    </Pressable>
  );
}

function SecondaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="rounded border border-gray-300 bg-white px-4 py-3 active:opacity-80">
      <Text className="text-center font-semibold text-gray-900">{title}</Text>
    </Pressable>
  );
}

function DestructiveButton({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded bg-red-600 px-4 py-3 active:opacity-80 ${disabled ? 'opacity-60' : ''}`}>
      <Text className="text-center font-semibold text-white">{title}</Text>
    </Pressable>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text className="mb-2 text-sm font-semibold text-gray-800">{children}</Text>;
}

function ActionCard({ title, subtitle, onPress }: { title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded border border-gray-200 bg-white p-4 active:opacity-80">
      <Text className="text-base font-semibold text-gray-900">{title}</Text>
      <Text className="mt-1 text-sm text-gray-600">{subtitle}</Text>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const [loggingOut, setLoggingOut] = useState(false);
  const [email, setEmail] = useState<string | null>(auth.currentUser?.email ?? null);
  const [displayName, setDisplayName] = useState<string | null>(auth.currentUser?.displayName ?? null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setEmail(user?.email ?? null);
      setDisplayName(user?.displayName ?? null);
    });
    return unsub;
  }, []);

  const initials = useMemo(() => {
    const base = (displayName || email || 'Guest').trim();
    const parts = base.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? 'G';
    const second = parts.length > 1 ? parts[1]?.[0] : (parts[0]?.[1] ?? '');
    return (first + second).toUpperCase();
  }, [displayName, email]);

  const accountTitle = displayName?.trim() || (email ? 'Signed in' : 'Guest');
  const accountSubtitle = email ? email : 'Sign in to sync your account across devices.';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      <View className="px-5 pb-4 pt-2">
        <Text className="text-2xl font-semibold">Profile</Text>
        <Text className="mt-1 text-sm text-gray-600">Account, resume, and app settings.</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 16 }}>
        <View className="rounded-lg border border-gray-200 bg-white p-4">
          <View className="flex-row items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Text className="text-base font-bold text-gray-900">{initials}</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-gray-900">{accountTitle}</Text>
              <Text className="mt-0.5 text-sm text-gray-600">{accountSubtitle}</Text>
            </View>
          </View>

          {!email ? (
            <View className="mt-4">
              <PrimaryButton title="Sign In" onPress={() => router.push('/(auth)/signin')} />
              <View className="mt-3">
                <SecondaryButton title="Create Account" onPress={() => router.push('/(auth)/signup')} />
              </View>
            </View>
          ) : null}
        </View>

        <View className="mt-6">
          <SectionTitle>Resume</SectionTitle>
          <ActionCard
            title="Edit CV Data"
            subtitle="Update your details, experience, skills, and summary."
            onPress={() => router.push('/(tabs)/cv-data')}
          />
          <View className="mt-3">
            <ActionCard
              title="Resume Templates"
              subtitle="Preview templates and download as PDF."
              onPress={() => router.push('/(tabs)/resume')}
            />
          </View>
        </View>

        <View className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <Text className="text-sm font-semibold text-gray-800">Storage</Text>
          <Text className="mt-2 text-sm text-gray-700">
            Your CV is saved locally on this device.
          </Text>
        </View>

        {email ? (
          <View className="mt-6">
            <DestructiveButton
              title={loggingOut ? 'Logging out…' : 'Log Out'}
              disabled={loggingOut}
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
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
