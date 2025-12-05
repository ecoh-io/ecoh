import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Button, Header } from '@/src/components/atoms';
import { useDateForm } from '../hooks/useDateForm';

import { Ionicons } from '@expo/vector-icons';
import { DateOfBirth } from '@/src/components/ui/inputs/DateOfBirth';

function DateForm() {
  const { colors } = useTheme();
  const { formik, isFormIncomplete } = useDateForm();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.contentContainer}>
        <Header
          title="Date of Birth"
          subtitle="Your date of birth is only used to verify your age, it won’t appear on your profile."
          icon={
            <Ionicons name="calendar-outline" size={32} color={colors.text} />
          }
        />

        <DateOfBirth
          formik={formik}
          name="dateOfBirth"
          label="Date of Birth"
          value={formik.values.dateOfBirth}
          onChange={(date) => formik.setFieldValue('dateOfBirth', date)}
          error={
            formik.touched.dateOfBirth ? formik.errors.dateOfBirth : undefined
          }
          helperText="Used to verify your age. It won’t appear on your profile"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          gradientColors={['#00c6ff', '#0072ff']}
          onPress={formik.handleSubmit}
          disabled={formik.isSubmitting || isFormIncomplete}
          title="Continue"
          size="large"
        />
      </View>
    </View>
  );
}

export default DateForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 26,
  },
  formContainer: {
    flexShrink: 0,
    gap: 26,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
