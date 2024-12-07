import Header from '@/src/components/Profile/Edit/Header';
import { useAuthStore } from '@/src/store/AuthStore';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import Input from '@/src/UI/Input';
import { useCallback, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native';

const MAX_BIO_LENGTH = 150;
const Bio: React.FC = () => {
  const user = useAuthStore((saved) => saved.user);
  const { colors } = useTheme();

  const [bio, setBio] = useState<string>(user?.bio || '');

  const handleChangeText = useCallback(
    (text: string) => {
      if (text.length <= MAX_BIO_LENGTH) {
        setBio(text);
      }
    },
    [setBio],
  );

  const save = () => {
    console.log('Bio updated:', bio);
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Bio"
        colors={colors}
        save={save}
        isSaving={false}
        isDisabled={false}
      />
      <View style={styles.bioContainer}>
        <Input
          placeholder="Bio"
          multiline={true}
          containerStyle={styles.bioInputContainer}
          value={bio}
          onChangeText={handleChangeText}
          keyboardType="numbers-and-punctuation"
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
