import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { EditScreenInfo } from '../../src/components/EditScreenInfo';

type ScreenName = 'Welcome' | 'Home' | 'Resume' | 'Profile' | 'SignIn' | 'SignUp';

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
  onNavigate?: React.Dispatch<React.SetStateAction<ScreenName>>;
  showNavigation?: boolean;
};

export const ScreenContent = ({ title, path, children, onNavigate, showNavigation = true }: ScreenContentProps) => {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>{title}</Text>
      <View className={styles.separator} />
      <EditScreenInfo path={path} />
      {children}
      {showNavigation && (
        <View className={styles.navigationContainer}>
          <TouchableOpacity
            className={styles.navButton}
            onPress={() => onNavigate?.('Home')}
          >
            <Ionicons name="home" size={28} color="#007AFF" />
            <Text className={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={styles.navButton}
            onPress={() => onNavigate?.('Resume')}
          >
            <Ionicons name="document-text" size={28} color="#007AFF" />
            <Text className={styles.navText}>Resume</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={styles.navButton}
            onPress={() => onNavigate?.('Profile')}
          >
            <Ionicons name="person" size={28} color="#007AFF" />
            <Text className={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const styles = {
  container: `items-center flex-1 justify-center bg-white relative pb-24`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
  navigationContainer: `absolute bottom-0 left-0 right-0 flex-row justify-around px-5 py-3 bg-white border-t border-gray-200`,
  navButton: `items-center justify-center px-4 py-2`,
  navText: `text-sm mt-1 text-gray-700 font-medium`,
};
