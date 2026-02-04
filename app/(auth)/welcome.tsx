import React from 'react';
import { useRouter } from 'expo-router';
import { View, Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeRoute() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="px-5 pb-4 pt-2">
        <Text className="text-2xl font-semibold">Welcome</Text>
      </View>

      <View className="flex-1 items-center">
        <View className="w-11/12 items-center">
          <Text className="mb-4 text-lg font-semibold">Welcome to ResumeBot</Text>
          <View className="mb-3 w-full">
            <Button title="Sign In" onPress={() => router.push('/(auth)/signin')} />
          </View>
          <View className="mb-3 w-full">
            <Button title="Sign Up" onPress={() => router.push('/(auth)/signup')} />
          </View>
          <View className="w-full">
            <Button title="Continue as Guest" onPress={() => router.replace('/(tabs)/home')} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
