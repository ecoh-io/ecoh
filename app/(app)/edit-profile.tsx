import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import Screen from '@/src/UI/Screen';
import { User } from '@/src/types/user';
import { Colors } from '@/src/types/color';
import { useTheme } from '@/src/theme/ThemeContext';
import { useAuthStore } from '@/src/store/AuthStore';
import { router } from 'expo-router';
import { typography } from '@/src/theme/typography';
import TouchableRow from '@/src/components/Profile/Edit/TouchableRow/TouchableRow';
import ProfileInfo from '@/src/components/Profile/Edit/ProfileInfo';

// Constants

interface HeaderProps {
  onBackPress: () => void;
  title: string;
  colors: Colors;
}
// Reusable Header Component
const Header: React.FC<HeaderProps> = ({ onBackPress, title, colors }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
      <Entypo name="chevron-left" size={32} color={colors.text} />
    </TouchableOpacity>
    <Text style={styles.headerText}>{title}</Text>
    <View style={styles.headerSpacer} />
  </View>
);

// Main Edit Profile Screen Component
const EditProfileScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const user = useAuthStore((state) => state.user);
  // Handlers for editing fields
  const handleEditName = () => {
    // Navigate to Edit Name Screen or open a modal
    console.log('Edit Name Pressed');
  };

  const handleEditUsername = () => {
    // Navigate to Edit Username Screen or open a modal
    console.log('Edit Username Pressed');
  };

  const handleEditBio = () => {
    // Navigate to Edit Bio Screen or open a modal
    console.log('Edit Bio Pressed');
  };

  return (
    <Screen
      preset="auto"
      safeAreaEdges={['top', 'bottom']}
      backgroundColor={colors.background}
      contentContainerStyle={styles.screenContent}
      statusBarStyle={isDark ? 'light' : 'dark'}
    >
      <Header
        onBackPress={() => router.back()}
        title="Edit Profile"
        colors={colors}
      />

      <ProfileInfo user={user} colors={colors} />

      <View style={styles.inputsContainer}>
        <TouchableRow
          iconName="user"
          label="Name"
          value={user?.displayName}
          onPress={handleEditName}
          colors={colors}
        />
        <TouchableRow
          iconName="at-sign"
          label="Username"
          value={user?.username}
          onPress={handleEditUsername}
          colors={colors}
        />
        <TouchableRow
          iconName="file-text"
          label="Bio"
          value={user?.bio?.trim() ? user.bio : 'Add bio'}
          onPress={handleEditBio}
          colors={colors}
        />
        <TouchableRow
          iconName="link"
          label="Links"
          value={user?.bio?.trim() ? user.bio : 'Add links'}
          onPress={handleEditBio}
          colors={colors}
        />
        <TouchableRow
          iconName="users"
          label="Gender"
          value={user?.bio?.trim() ? user.bio : 'Add gender'}
          onPress={handleEditBio}
          colors={colors}
        />
      </View>
    </Screen>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40, // To balance the back button
  },
  inputsContainer: {
    flexDirection: 'column',
    gap: 30,
    paddingVertical: 20,
  },
});

export default EditProfileScreen;
