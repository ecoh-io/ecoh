import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { useAuthStore } from '@/src/store/AuthStore';
import { Href, useRouter } from 'expo-router';
import TouchableRow from '@/src/components/Profile/Edit/TouchableRow/TouchableRow';
import ProfileInfo from '@/src/components/Profile/Edit/ProfileInfo';
import Header from '@/src/components/Profile/Edit/Header';
import { useEdit } from '@/src/context/EditContext';

const useEditProfileNavigation = () => {
  const router = useRouter();

  const navigateTo = (section: Href) => {
    router.push(section);
  };

  return {
    handleEditName: () => navigateTo('/(app)/edit/name'),
    handleEditUsername: () => navigateTo('/(app)/edit/username'),
    handleEditBio: () => navigateTo('/(app)/edit/bio'),
    handleEditLinks: () => navigateTo('/(app)/edit/links'),
    handleEditGender: () => navigateTo('/(app)/edit/gender'),
    handleEditLocation: () => navigateTo('/(app)/edit/location'),
  };
};
// Main Edit Profile Screen Component
const EditProfileScreen: React.FC = () => {
  const { user } = useEdit();
  const { colors } = useTheme();
  const {
    handleEditName,
    handleEditUsername,
    handleEditBio,
    handleEditLinks,
    handleEditGender,
    handleEditLocation,
  } = useEditProfileNavigation();

  console.log('Edit profile screen', user?.profile.city);

  if (!user) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Edit profile" colors={colors} />

      <ProfileInfo user={user} colors={colors} />

      <View style={styles.inputsContainer}>
        <TouchableRow
          iconName="user"
          label="Name"
          value={user.name}
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
          value={user.profile.bio?.trim() ? user.profile.bio : 'Add bio'}
          onPress={handleEditBio}
          colors={colors}
        />
        <TouchableRow
          iconName="link"
          label="Links"
          value={user.profile.links ? user.profile.links : 'Add links'}
          onPress={handleEditLinks}
          colors={colors}
        />
        <TouchableRow
          iconName="users"
          label="Gender"
          value={user.profile.gender ? user.profile.gender : 'Add gender'}
          onPress={handleEditGender}
          colors={colors}
        />
        <TouchableRow
          iconName="map-pin"
          label="Location"
          value={
            user.profile.location && user.profile.city && user.profile.region
              ? `${user.profile.city}, ${user.profile.region}`
              : 'Add location'
          }
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
