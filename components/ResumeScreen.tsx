import React from 'react';
import { View } from 'react-native';
import { ScreenContent } from './ScreenContent';

type Props = {
  onNavigate?: (screen: string) => void;
};

export default function ResumeScreen({ onNavigate }: Props) {
  return (
    <ScreenContent title="Resume" path="components/ResumeScreen.tsx" onNavigate={onNavigate}>
      <View />
    </ScreenContent>
  );
}
