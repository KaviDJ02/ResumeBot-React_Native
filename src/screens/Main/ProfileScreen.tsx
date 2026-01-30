import React from 'react';
import { View } from 'react-native';
import { ScreenContent } from '../../components/ScreenContent';

type ScreenName = 'Welcome' | 'Home' | 'Resume' | 'Profile' | 'SignIn' | 'SignUp';

type Props = {
  onNavigate?: React.Dispatch<React.SetStateAction<ScreenName>>;
};

export default function ProfileScreen({ onNavigate }: Props) {
  return (
    <ScreenContent title="Profile" path="src/screens/Main/ProfileScreen.tsx" onNavigate={onNavigate}>
      <View />
    </ScreenContent>
  );
}
