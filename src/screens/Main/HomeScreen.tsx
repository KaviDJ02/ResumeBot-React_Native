import React from 'react';
import { View } from 'react-native';
import { ScreenContent } from '../../components/ScreenContent';

type ScreenName = 'Welcome' | 'Home' | 'Resume' | 'Profile' | 'SignIn' | 'SignUp';

type Props = {
  onNavigate?: React.Dispatch<React.SetStateAction<ScreenName>>;
};

export default function HomeScreen({ onNavigate }: Props) {
  return (
    <ScreenContent title="Home" path="src/screens/Main/HomeScreen.tsx" onNavigate={onNavigate}>
      <View />
    </ScreenContent>
  );
}
