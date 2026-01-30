import React from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { ScreenContent } from '../../components/ScreenContent';

type ScreenName = 'Welcome' | 'Home' | 'Resume' | 'Profile' | 'SignIn' | 'SignUp';

type Props = {
  onNavigate?: React.Dispatch<React.SetStateAction<ScreenName>>;
};

export default function SignInScreen({ onNavigate }: Props) {
  return (
    <ScreenContent title="Sign In" path="src/screens/Auth/SignInScreen.tsx" onNavigate={onNavigate} showNavigation={false}>
      <View className="w-11/12">
        <Text className="text-base font-medium mb-2">Email</Text>
        <TextInput className="border p-2 rounded mb-4" placeholder="you@example.com" />
        <Text className="text-base font-medium mb-2">Password</Text>
        <TextInput className="border p-2 rounded mb-4" placeholder="••••••••" secureTextEntry />
        <Button title="Sign In" onPress={() => onNavigate?.('Home')} />
        <View className="mt-3">
          <Button title="Go to Sign Up" onPress={() => onNavigate?.('SignUp')} />
        </View>
      </View>
    </ScreenContent>
  );
}
