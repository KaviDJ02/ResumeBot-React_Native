import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="px-5 pt-2 pb-4">
        <Text className="text-2xl font-semibold">Profile</Text>
      </View>

      <View className="flex-1 items-center">
        <View className="w-11/12">
          <Text className="text-base">Profile screen</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
