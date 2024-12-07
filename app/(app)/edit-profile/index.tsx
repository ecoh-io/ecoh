import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { useAuthStore } from '@/src/store/AuthStore';
import { router, useRouter } from 'expo-router';
import TouchableRow from '@/src/components/Profile/Edit/TouchableRow/TouchableRow';
import ProfileInfo from '@/src/components/Profile/Edit/ProfileInfo';
import Header from '@/src/components/Profile/Edit/Header';

// Main Edit Profile Screen Component
const EditProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  // Handlers for editing fields
  const handleEditName = () => {
    router.push('/edit-profile/name');
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Edit profile" colors={colors} />

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
        <TouchableRow
          iconName="map-pin"
          label="Location"
          value={user?.bio?.trim() ? user.bio : 'Add location'}
          onPress={handleEditBio}
          colors={colors}
        />
      </View>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inputsContainer: {
    flexDirection: 'column',
    gap: 30,
    paddingVertical: 20,
  },
});

export default EditProfileScreen;
