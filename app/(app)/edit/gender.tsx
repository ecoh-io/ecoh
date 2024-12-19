import RadioButtonGroup from '@/src/components/atoms/radioButtonGroup';
import Header from '@/src/components/Profile/Edit/Header';
import { useEdit } from '@/src/context/EditContext';
import { Gender } from '@/src/enums/gender.enum';
import { useUpdateUser } from '@/src/hooks/useUpdateUserProfile';
import { useAuthStore } from '@/src/store/AuthStore';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { useState } from 'react';
import { Alert, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';

const genderOptions = [
  { label: 'Male', value: Gender.MALE },
  { label: 'Female', value: Gender.FEMALE },
  { label: 'Non-Binary', value: Gender.NON_BINARY },
  { label: 'Prefer not to say', value: Gender.NOT_SAY },
];

const GenderScreen: React.FC = () => {
  const { user, isLoading, updateGender } = useEdit();
  const { colors } = useTheme();

  const [gender, setGender] = useState<Gender>(
    user?.profile.gender || Gender.NOT_SAY,
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Gender"
        colors={colors}
        save={() => updateGender(gender)}
        isSaving={isLoading}
        isDisabled={isLoading}
      />
      <View style={styles.container}>
        <RadioButtonGroup
          options={genderOptions}
          selectedValue={gender}
          onValueChange={(value) => setGender(value as Gender)}
          direction="vertical"
        />
        <Text style={styles.info}>
          {'This will not been shown on your public profile.'}
        </Text>
      </View>
    </View>
  );
};

export default GenderScreen;

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
