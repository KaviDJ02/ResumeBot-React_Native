import React from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { ScreenContent } from '../../components/ScreenContent';

type ScreenName = 'Welcome' | 'Home' | 'Resume' | 'Profile' | 'SignIn' | 'SignUp';

type Props = {
  onNavigate?: React.Dispatch<React.SetStateAction<ScreenName>>;
};

export default function SignUpScreen({ onNavigate }: Props) {
  return (
    <ScreenContent title="Sign Up" path="src/screens/Auth/SignUpScreen.tsx" onNavigate={onNavigate} showNavigation={false}>
      <View className="w-11/12">
        <Text className="text-base font-medium mb-2">Name</Text>
        <TextInput className="border p-2 rounded mb-4" placeholder="Your name" />
        <Text className="text-base font-medium mb-2">Email</Text>
        <TextInput className="border p-2 rounded mb-4" placeholder="you@example.com" />
        <Text className="text-base font-medium mb-2">Password</Text>
        <TextInput className="border p-2 rounded mb-4" placeholder="••••••••" secureTextEntry />
        <Button title="Create account" onPress={() => onNavigate?.('Home')} />
        <View className="mt-3">
          <Button title="Have an account? Sign In" onPress={() => onNavigate?.('SignIn')} />
        </View>
      </View>
    </ScreenContent>
  );
}
