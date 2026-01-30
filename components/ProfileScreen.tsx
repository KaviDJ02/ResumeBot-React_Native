import React from 'react';
import { View } from 'react-native';
import { ScreenContent } from './ScreenContent';

type Props = {
  onNavigate?: (screen: string) => void;
};

export default function ProfileScreen({ onNavigate }: Props) {
  return (
    <ScreenContent title="Profile" path="components/ProfileScreen.tsx" onNavigate={onNavigate}>
      <View />
    </ScreenContent>
  );
}
