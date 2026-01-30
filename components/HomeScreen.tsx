import React from 'react';
import { View } from 'react-native';
import { ScreenContent } from './ScreenContent';

type Props = {
  onNavigate?: (screen: string) => void;
};

export default function HomeScreen({ onNavigate }: Props) {
  return (
    <ScreenContent title="Home" path="components/HomeScreen.tsx" onNavigate={onNavigate}>
      <View />
    </ScreenContent>
  );
}
