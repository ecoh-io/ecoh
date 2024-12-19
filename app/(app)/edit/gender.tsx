import RadioButtonGroup from '@/src/components/atoms/radioButtonGroup';
import Header from '@/src/components/Profile/Edit/Header';
import { useEdit } from '@/src/context/EditContext';
import { Gender, genderOptions } from '@/src/enums/gender.enum';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { useState } from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';

const GenderScreen: React.FC = () => {
  const { user, isLoading, updateGender } = useEdit();
  const { colors } = useTheme();

  const [gender, setGender] = useState<Gender>(
    user?.profile.gender || Gender.NOT_SAY,
  );

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: colors.background,
      }}
    >
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
