import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './components/HomeScreen';
import ResumeScreen from './components/ResumeScreen';
import ProfileScreen from './components/ProfileScreen';

import './global.css';

export default function App() {
  const [screen, setScreen] = useState<'Home' | 'Resume' | 'Profile'>('Home');

  const renderScreen = () => {
    switch (screen) {
      case 'Resume':
        return <ResumeScreen onNavigate={setScreen} />;
      case 'Profile':
        return <ProfileScreen onNavigate={setScreen} />;
      case 'Home':
      default:
        return <HomeScreen onNavigate={setScreen} />;
    }
  };

  return (
    <>
      {renderScreen()}
      <StatusBar style="auto" />
    </>
  );
}
