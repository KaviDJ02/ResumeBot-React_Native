import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// EditScreenInfo removed — screens should only show the title and content

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
    <SafeAreaView className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>{title}</Text>
        <View className={styles.separator} />
      </View>

      <View className={styles.content}>{children}</View>
      {showNavigation && (
        <View className={styles.navigationContainer}>
          <TouchableOpacity
            className={styles.navButton}
            onPress={() => onNavigate?.('Home')}
          >
            <Ionicons name="home" size={28} color="#000000" />
            <Text className={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={styles.navButton}
            onPress={() => onNavigate?.('Resume')}
          >
            <Ionicons name="document-text" size={28} color="#000000" />
            <Text className={styles.navText}>Resume</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={styles.navButton}
            onPress={() => onNavigate?.('Profile')}
          >
            <Ionicons name="person" size={28} color="#000000" />
            <Text className={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = {
  container: `flex-1 bg-white relative pb-24`,
  header: `w-full items-center pt-20 px-4`,
  content: `flex-1 w-full items-center justify-start px-4`,
  separator: `h-[1px] my-3 w-full bg-gray-200`,
  title: `text-xl font-bold mt-20`,
  navigationContainer: `absolute bottom-0 left-0 right-0 flex-row justify-around px-5 py-3 bg-white border-t border-gray-200`,
  navButton: `items-center justify-center px-4 py-2`,
  navText: `text-sm mt-1 text-gray-700 font-medium`,
};
