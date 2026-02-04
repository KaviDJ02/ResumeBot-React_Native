import React from 'react';
import { useRouter } from 'expo-router';
import { View, TextInput, Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInRoute() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="px-5 pb-4 pt-2">
        <Text className="text-2xl font-semibold">Sign In</Text>
      </View>

      <View className="flex-1 items-center">
        <View className="w-11/12">
          <Text className="mb-2 text-base font-medium">Email</Text>
          <TextInput className="mb-4 rounded border p-2" placeholder="you@example.com" />
          <Text className="mb-2 text-base font-medium">Password</Text>
          <TextInput className="mb-4 rounded border p-2" placeholder="••••••••" secureTextEntry />
          <Button title="Sign In" onPress={() => router.replace('/(tabs)/home')} />
          <View className="mt-3">
            <Button title="Go to Sign Up" onPress={() => router.push('/(auth)/signup')} />
          </View>
          <View className="mt-3">
            <Button title="Back" onPress={() => router.replace('/(auth)/welcome')} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
