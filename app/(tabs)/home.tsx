import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="px-5 pt-2 pb-4">
        <Text className="text-2xl font-semibold">Home</Text>
      </View>

      <View className="flex-1 items-center">
        <View className="w-11/12">
          <Text className="text-base">Home screen</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
