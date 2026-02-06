import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { auth } from '@/firebase';

export default function SignUpRoute() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSignUp() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail || !password) {
      Alert.alert('Missing info', 'Please enter your name, email, and password.');
      return;
    }

    if (submitting) return;
    setSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      await updateProfile(cred.user, { displayName: trimmedName });
      router.replace('/(tabs)/home');
    } catch (e) {
      Alert.alert('Sign up failed', e instanceof Error ? e.message : 'Unknown error.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="px-5 pb-4 pt-2">
        <Text className="text-2xl font-semibold">Sign Up</Text>
      </View>

      <View className="flex-1 items-center">
        <View className="w-11/12">
          <Text className="mb-2 text-base font-medium">Name</Text>
          <TextInput
            className="mb-4 rounded border p-2"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
          />
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
          <Button title={submitting ? 'Creating…' : 'Create account'} onPress={onSignUp} />
          <View className="mt-3">
            <Button
              title="Have an account? Sign In"
              onPress={() => router.push('/(auth)/signin')}
            />
          </View>
          <View className="mt-3">
            <Button title="Back" onPress={() => router.replace('/(auth)/welcome')} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
