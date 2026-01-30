import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/Main/HomeScreen';
import ResumeScreen from './src/screens/Main/ResumeScreen';
import ProfileScreen from './src/screens/Main/ProfileScreen';
import SignInScreen from './src/screens/Auth/SignInScreen';
import SignUpScreen from './src/screens/Auth/SignUpScreen';
import WelcomeScreen from './src/screens/Auth/WelcomeScreen';

import './global.css';

export default function App() {
  const [screen, setScreen] = useState<'Welcome' | 'Home' | 'Resume' | 'Profile' | 'SignIn' | 'SignUp'>('Welcome');

  const renderScreen = () => {
    switch (screen) {
      case 'Resume':
        return <ResumeScreen onNavigate={setScreen} />;
      case 'Profile':
        return <ProfileScreen onNavigate={setScreen} />;
      case 'SignIn':
        return <SignInScreen onNavigate={setScreen} />;
      case 'SignUp':
        return <SignUpScreen onNavigate={setScreen} />;
      case 'Home':
        return <HomeScreen onNavigate={setScreen} />;
      case 'Welcome':
      default:
        return <WelcomeScreen onNavigate={setScreen} />;
    }
  };

  return (
    <>
      {renderScreen()}
      <StatusBar style="auto" />
    </>
  );
}
