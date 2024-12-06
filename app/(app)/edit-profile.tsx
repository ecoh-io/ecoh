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

// Constants
const PROFILE_IMAGE_URL = 'https://via.placeholder.com/100';

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

interface ProfileInfoProps {
  user: User;
  colors: Colors;
}
// Reusable Profile Info Component
const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, colors }) => (
  <View style={styles.imageContainer}>
    <Image
      source={{ uri: PROFILE_IMAGE_URL }}
      style={styles.profileImage}
      accessibilityLabel="Profile picture"
    />
    <View style={styles.profileTextContainer}>
      <Text style={styles.name}>{user.displayName ?? 'Unnamed User'}</Text>
      <Text style={[styles.username, { color: colors.backdrop }]}>
        {user.username ?? 'username'}
      </Text>
    </View>
  </View>
);

interface ProfileInputRowProps {
  iconName: string;
  label: string;
  value: string;
  onPress: () => void;
  colors: Colors;
}
// Reusable Input Row Component
const ProfileInputRow: React.FC<ProfileInputRowProps> = ({
  iconName,
  label,
  value,
  onPress,
  colors,
}) => (
  <TouchableOpacity style={styles.inputContainer} onPress={onPress}>
    <View style={styles.inputRow}>
      <Feather name={iconName as any} size={44} color={colors.text} />
      <View style={styles.inputTextContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Text
          style={[styles.inputValue, { color: colors.backdrop }]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
    <Entypo name="chevron-right" size={28} color={colors.highlight} />
  </TouchableOpacity>
);

interface EditProfileScreenProps {
  colors: Colors;
  isDark: boolean;
  backPressed: () => void;
  user: User;
}
// Main Edit Profile Screen Component
const EditProfileScreen: React.FC<EditProfileScreenProps> = () => {
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
        isDark={isDark}
        colors={colors}
      />

      <ProfileInfo user={user} colors={colors} />

      <View style={styles.inputsContainer}>
        <ProfileInputRow
          iconName="user"
          label="Name"
          value={user?.displayName}
          onPress={handleEditName}
          colors={colors}
        />
        <ProfileInputRow
          iconName="at-sign"
          label="Username"
          value={user?.username}
          onPress={handleEditUsername}
          colors={colors}
        />
        <ProfileInputRow
          iconName="file-text"
          label="Bio"
          value={user?.bio?.trim() ? user.bio : 'Add bio'}
          onPress={handleEditBio}
          colors={colors}
        />
        <ProfileInputRow
          iconName="link"
          label="Links"
          value={user?.bio?.trim() ? user.bio : 'Add links'}
          onPress={handleEditBio}
          colors={colors}
        />
        <ProfileInputRow
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
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
    gap: 5,
  },
  name: {
    fontSize: typography.fontSizes.title,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  username: {
    fontSize: typography.fontSizes.smallTitle,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  inputsContainer: {
    flexDirection: 'column',
    gap: 30,
    paddingVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputTextContainer: {
    flexDirection: 'column',
    marginLeft: 10,
    flex: 1,
  },
  inputLabel: {
    fontSize: typography.fontSizes.smallTitle,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  inputValue: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});

export default EditProfileScreen;
