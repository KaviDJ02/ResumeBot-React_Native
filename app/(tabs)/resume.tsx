import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResumeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="px-5 pb-4 pt-2">
        <Text className="text-2xl font-semibold">Resume</Text>
      </View>

      <View className="flex-1 items-center">
        <View className="w-11/12">
          <Text className="text-base">Resume screen</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
