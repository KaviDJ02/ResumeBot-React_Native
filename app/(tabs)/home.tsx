import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { auth } from '@/firebase';

export default function HomeScreen() {
  const [email, setEmail] = useState<string | null>(auth.currentUser?.email ?? null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setEmail(user?.email ?? null);
    });
    return unsub;
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="px-5 pb-4 pt-2">
        <Text className="text-2xl font-semibold">Home</Text>
        <Text className="mt-1 text-sm text-gray-600">
          {greeting}{email ? ` • Signed in as ${email}` : ' • Guest mode'}
        </Text>
      </View>

      <View className="flex-1 px-5">
        <View className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <Text className="text-base font-semibold">Build your resume in minutes</Text>
          <Text className="mt-1 text-sm text-gray-700">
            Fill your CV once, then preview templates and export PDF anytime.
          </Text>
        </View>

        <View className="mt-4">
          <Text className="mb-2 text-sm font-semibold text-gray-800">Quick actions</Text>

          <Pressable
            onPress={() => router.push('/(tabs)/cv-data')}
            className="rounded border border-gray-200 bg-white p-4 active:opacity-80">
            <Text className="text-base font-semibold">Edit CV Data</Text>
            <Text className="mt-1 text-sm text-gray-600">
              Update personal info, experience, education, projects, skills.
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/resume')}
            className="mt-3 rounded border border-gray-200 bg-white p-4 active:opacity-80">
            <Text className="text-base font-semibold">View Resume Templates</Text>
            <Text className="mt-1 text-sm text-gray-600">
              Preview templates and download as PDF.
            </Text>
          </Pressable>
        </View>

        <View className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
          <Text className="text-sm font-semibold text-gray-800">Tips</Text>
          <Text className="mt-2 text-sm text-gray-700">
            - Keep bullet points results-focused (impact + numbers).
          </Text>
          <Text className="mt-1 text-sm text-gray-700">- Match keywords from the job description.</Text>
          <Text className="mt-1 text-sm text-gray-700">
            - Use a short professional summary for your target role.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
