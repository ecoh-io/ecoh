import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Href, useRouter } from 'expo-router';
import { useEdit } from '@/src/context/EditContext';
import { getGenderDisplay } from '@/src/enums/gender.enum';
import TouchableRow from '@/src/components/molecules/TouchableRow';
import ProfileInfo from '@/src/components/organisms/Profile/EditProfileInfo';
import { EditHeader } from '@/src/components/molecules/Profile';

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

  if (!user) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <EditHeader title="Edit profile" colors={colors} />

      <ProfileInfo user={user} colors={colors} />

      <View style={[styles.inputsContainer, { borderColor: colors.highlight }]}>
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
          value={
            user.profile.gender
              ? getGenderDisplay(user.profile.gender)
              : 'Add gender'
          }
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
          isLastItem={true}
        />
      </View>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },

  inputsContainer: {
    flexDirection: 'column',
    marginVertical: 30,
    marginHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
});

export default EditProfileScreen;
