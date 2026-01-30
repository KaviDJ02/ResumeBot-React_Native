import React from 'react';
import { View } from 'react-native';
import { ScreenContent } from '../../components/ScreenContent';

type ScreenName = 'Welcome' | 'Home' | 'Resume' | 'Profile' | 'SignIn' | 'SignUp';

type Props = {
  onNavigate?: React.Dispatch<React.SetStateAction<ScreenName>>;
};

export default function ResumeScreen({ onNavigate }: Props) {
  return (
    <ScreenContent title="Resume" path="src/screens/Main/ResumeScreen.tsx" onNavigate={onNavigate}>
      <View />
    </ScreenContent>
  );
}
