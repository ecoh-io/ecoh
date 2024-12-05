import React, { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegistration } from '@/src/context/RegistrationContext';
import OTPInput from '@/src/UI/OTPInput';
import Button from '@/src/UI/Button';
import { useTheme } from '@/src/theme/ThemeContext';
import { Footer, Header } from '@/src/components/atoms';
import { useConfirmUser } from '@/src/hooks/useConfirmUser';

interface FormValues {
  OTP: string;
}

const otpSchema = Yup.object().shape({
  OTP: Yup.string()
    .required('OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^\d+$/, 'OTP must be a number'),
});

export default function OneTimePasscode() {
  const { state, handleSubmitStep } = useRegistration();
  const { colors } = useTheme();

  const formik = useFormik<FormValues>({
    initialValues: { OTP: state.formData.code },
    validationSchema: otpSchema,
    onSubmit: async (values: FormValues, { setSubmitting }) => {
      try {
        const registrationData = {
          identifier: state.formData.identifier!,
          code: values.OTP,
          password: state.formData.password,
          displayName: state.formData.name,
          username: state.formData.username,
          dateOfBirth: state.formData.dateOfBirth!,
        };

        await mutateAsync(registrationData);

        await handleSubmitStep(otpSchema, ['code'], { code: values.OTP });
      } catch (error) {
        formik.setStatus({
          formError: 'An unexpected error occurred. Please try again.',
        });
      } finally {
        setSubmitting(false);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const { mutateAsync } = useConfirmUser({
    onError: (error: any) => {
      if (error?.status === 400) {
        formik.setErrors({ OTP: 'Invalid confirmation code.' });
      } else {
        formik.setStatus({
          formError: 'Registration failed. Please try again.',
        });
      }
    },
  });

  // Memoized handlers to prevent unnecessary re-renders
  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Enter the confirmation code"
        subtitle={`To confirm your account, enter the 6-digit code that we sent to ${state.formData.identifier}`}
      />
      <View style={styles.formContainer}>
        <OTPInput
          length={6}
          value={formik.values.OTP}
          onChange={(value) => formik.setFieldValue('OTP', value)}
          autoFocus
          isNumeric
          error={
            formik.touched.OTP && formik.errors.OTP ? formik.errors.OTP : ''
          }
        />

        <Button
          title="Didn't receive code?"
          onPress={() => {}}
          variant="secondary"
          size="large"
        />
      </View>
      <Footer
        onPress={handleContinuePress}
        isDisabled={!formik.isValid || formik.isSubmitting}
        isLoading={formik.isSubmitting}
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
    gap: 15,
    flexDirection: 'column',
  },
});
