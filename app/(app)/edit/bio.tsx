import Header from '@/src/components/Profile/Edit/Header';
import { useEdit } from '@/src/context/EditContext';
import { useUpdateUser } from '@/src/hooks/useUpdateUserProfile';
import { useAuthStore } from '@/src/store/AuthStore';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import Input from '@/src/UI/Input';
import { useCallback, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native';

const MAX_BIO_LENGTH = 150;
const Bio: React.FC = () => {
  const { user, isLoading, updateBio } = useEdit();
  const { colors } = useTheme();

  const [bio, setBio] = useState<string>(user?.profile.bio || '');

  const handleChangeText = useCallback(
    (text: string) => {
      if (text.length <= MAX_BIO_LENGTH) {
        setBio(text);
      }
    },
    [setBio],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Bio"
        colors={colors}
        save={() => updateBio(bio)}
        isSaving={isLoading}
        isDisabled={isLoading}
      />
      <View style={styles.bioContainer}>
        <Input
          placeholder="Bio"
          multiline={true}
          containerStyle={styles.bioInputContainer}
          value={bio}
          onChangeText={handleChangeText}
        />
        <Text style={styles.bioCounter}>
          {bio.length}/{MAX_BIO_LENGTH}
        </Text>
      </View>
    </View>
  );
};

export default Bio;

const styles = StyleSheet.create({
  bioContainer: {
    flex: 1,
    paddingVertical: 15,
  },
  bioInputContainer: {
    marginBottom: 0,
  },
  bioCounter: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
});
