import Input from '@/src/components/atoms/Input';
import { EditHeader } from '@/src/components/molecules/Profile';
import { useEdit } from '@/src/context/EditContext';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
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
    <View
      style={{
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: colors.background,
      }}
    >
      <EditHeader
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
          maxLength={280}
          showCharacterCount
        />
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
