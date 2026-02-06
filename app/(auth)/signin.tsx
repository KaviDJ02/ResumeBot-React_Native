import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '@/firebase';

export default function SignInRoute() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSignIn() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      Alert.alert('Missing info', 'Please enter your email and password.');
      return;
    }

    if (submitting) return;
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      router.replace('/(tabs)/home');
    } catch (e) {
      Alert.alert('Sign in failed', e instanceof Error ? e.message : 'Unknown error.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="px-5 pb-4 pt-2">
        <Text className="text-2xl font-semibold">Sign In</Text>
      </View>

      <View className="flex-1 items-center">
        <View className="w-11/12">
          <Text className="mb-2 text-base font-medium">Email</Text>
          <TextInput
            className="mb-4 rounded border p-2"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text className="mb-2 text-base font-medium">Password</Text>
          <TextInput
            className="mb-4 rounded border p-2"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button title={submitting ? 'Signing in…' : 'Sign In'} onPress={onSignIn} />
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
