import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';

export default function ResumeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="px-5 pb-4 pt-2">
        <Text className="text-2xl font-semibold">Resume</Text>
      </View>

      <View className="flex-1 px-5">
        <Pressable
          onPress={() => router.push('/(tabs)/resume-preview?template=ats')}
          className="rounded border border-gray-200 bg-white p-4 active:opacity-80">
          <Text className="text-base font-semibold">ATS Simple (Recommended)</Text>
          <Text className="mt-1 text-sm text-gray-600">
            Single-column, text-first, recruiter/ATS friendly.
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
