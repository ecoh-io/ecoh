import React, { useCallback } from 'react';
import { Footer, Header } from '@/src/components/atoms';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { StyleSheet, View } from 'react-native';
import { useRegistration } from '@/src/context/RegistrationContext';
import { useTheme } from '@/src/theme/ThemeContext';
import DateOfBirthInput from '@/src/UI/DateOfBirthInput';

const today = new Date();
const minDate = new Date(1900, 0, 1);
const maxDate = new Date(
  today.getFullYear() - 16,
  today.getMonth(),
  today.getDate(),
);

const dobSchema = yup.object().shape({
  dateOfBirth: yup
    .date()
    .required('Date of birth is required')
    .min(minDate, 'Year is too early')
    .max(maxDate, 'You must be at least 16 years old'),
});

interface FormValues {
  dateOfBirth: string;
}

export default function DateOfBirth() {
  const { state, handleSubmitStep } = useRegistration();
  const { colors } = useTheme();

  const formik = useFormik<FormValues>({
    initialValues: {
      dateOfBirth: state.formData.dateOfBirth,
    },
    validationSchema: dobSchema,
    onSubmit: async (values: FormValues) => {
      await handleSubmitStep(dobSchema, ['dateOfBirth'], {
        dateOfBirth: values.dateOfBirth,
      });
    },
  });

  // Memoized handlers to prevent unnecessary re-renders
  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="What's your date of birth?"
        subtitle="Enter your date of birth (you must be 16+). This won't appear on your profile."
      />
      <View style={styles.formContainer}>
        <DateOfBirthInput
          value={
            formik.values.dateOfBirth
              ? new Date(formik.values.dateOfBirth).toLocaleDateString()
              : ''
          }
          setFieldValue={formik.setFieldValue}
          fieldName="dateOfBirth"
          onBlur={() => formik.setFieldTouched('dateOfBirth', true)}
          error={
            formik.touched.dateOfBirth ? formik.errors.dateOfBirth : undefined
          }
          inputStyle={{ textAlign: 'center' }}
        />
      </View>
      <Footer
        onPress={handleContinuePress}
        isDisabled={!formik.isValid || formik.isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
});
