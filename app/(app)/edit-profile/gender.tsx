import RadioButtonGroup from '@/src/components/atoms/radioButtonGroup';
import Header from '@/src/components/Profile/Edit/Header';
import { useAuthStore } from '@/src/store/AuthStore';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { useState } from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-Binary', value: 'non-binary' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
];

const Gender: React.FC = () => {
  const user = useAuthStore((saved) => saved.user);
  const { colors } = useTheme();

  const [selectedGender, setSelectedGender] = useState<string>(
    user?.gender || 'prefer-not-to-say',
  );

  const save = () => {
    console.log('Gender updated: ', selectedGender);
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Gender"
        colors={colors}
        save={save}
        isSaving={false}
        isDisabled={false}
      />
      <View style={styles.container}>
        <RadioButtonGroup
          options={genderOptions}
          selectedValue={selectedGender}
          onValueChange={setSelectedGender}
          direction="vertical"
        />
        <Text style={styles.info}>
          {'This will not been shown on your public profile.'}
        </Text>
      </View>
    </View>
  );
};

export default Gender;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    flexDirection: 'column',
    gap: 20,
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
  info: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: 13,
    paddingHorizontal: 4,
  },
});
