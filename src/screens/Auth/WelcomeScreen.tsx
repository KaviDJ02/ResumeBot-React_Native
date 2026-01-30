import React from 'react';
import { View, Button, Text } from 'react-native';
import { ScreenContent } from '../../components/ScreenContent';

type ScreenName = 'Welcome' | 'Home' | 'Resume' | 'Profile' | 'SignIn' | 'SignUp';

type Props = {
  onNavigate?: React.Dispatch<React.SetStateAction<ScreenName>>;
};

export default function WelcomeScreen({ onNavigate }: Props) {
  return (
    <ScreenContent title="Welcome" path="src/screens/Auth/WelcomeScreen.tsx" onNavigate={onNavigate} showNavigation={false}>
      <View className="w-11/12 items-center">
        <Text className="text-lg font-semibold mb-4">Welcome to ResumeBot</Text>
        <View className="w-full mb-3">
          <Button title="Sign In" onPress={() => onNavigate?.('SignIn')} />
        </View>
        <View className="w-full mb-3">
          <Button title="Sign Up" onPress={() => onNavigate?.('SignUp')} />
        </View>
        <View className="w-full">
          <Button title="Continue as Guest" onPress={() => onNavigate?.('Home')} />
        </View>
      </View>
    </ScreenContent>
  );
}
