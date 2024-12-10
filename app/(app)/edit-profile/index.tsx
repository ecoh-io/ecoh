import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { useAuthStore } from '@/src/store/AuthStore';
import { useRouter } from 'expo-router';
import TouchableRow from '@/src/components/Profile/Edit/TouchableRow/TouchableRow';
import ProfileInfo from '@/src/components/Profile/Edit/ProfileInfo';
import Header from '@/src/components/Profile/Edit/Header';

// Main Edit Profile Screen Component
const EditProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleEditName = () => {
    router.push('/edit-profile/name');
  };

  const handleEditUsername = () => {
    router.push('/edit-profile/username');
  };

  const handleEditBio = () => {
    router.push('/edit-profile/bio');
  };

  const handleEditLinks = () => {
    router.push('/edit-profile/links');
  };

  const handleEditGender = () => {
    router.push('/edit-profile/gender');
  };

  const handleEditLocation = () => {
    router.push('/edit-profile/location');
  };

  if (!user) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Edit profile" colors={colors} />

      <ProfileInfo user={user} colors={colors} />

      <View style={styles.inputsContainer}>
        <TouchableRow
          iconName="user"
          label="Name"
          value={user.displayName}
          onPress={handleEditName}
          colors={colors}
        />
        <TouchableRow
          iconName="at-sign"
          label="Username"
          value={user.username}
          onPress={handleEditUsername}
          colors={colors}
        />
        <TouchableRow
          iconName="file-text"
          label="Bio"
          value={user.bio?.trim() ? user.bio : 'Add bio'}
          onPress={handleEditBio}
          colors={colors}
        />
        <TouchableRow
          iconName="link"
          label="Links"
          value={user.bio?.trim() ? user.bio : 'Add links'}
          onPress={handleEditLinks}
          colors={colors}
        />
        <TouchableRow
          iconName="users"
          label="Gender"
          value={user.gender ? user.gender : 'Add gender'}
          onPress={handleEditGender}
          colors={colors}
        />
        <TouchableRow
          iconName="map-pin"
          label="Location"
          value={user.location ? user.location : 'Add location'}
          onPress={handleEditLocation}
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
