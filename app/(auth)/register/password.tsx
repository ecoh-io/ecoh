import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Footer, Header } from '@/src/components/atoms';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegistration } from '@/src/context/RegistrationContext';
import Input from '@/src/UI/Input';
import { useTheme } from '@/src/theme/ThemeContext';

interface FormValues {
  password: string;
  confirmPassword: string;
}

const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[@$!%*#?&]/,
      'Password must contain at least one special character',
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export default function Password() {
  const { handleSubmitStep } = useRegistration();
  const { colors } = useTheme();

  // Toggle password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setConfirmPasswordVisible((prev) => !prev);
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: passwordSchema,
    onSubmit: async (values: FormValues, { setSubmitting }) => {
      try {
        await handleSubmitStep(passwordSchema, ['password'], {
          password: values.password,
        });
      } catch (error) {
        console.error('Error submitting password:', error);
      } finally {
        setSubmitting(false);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const getIconColor = useCallback(
    (fieldName: keyof FormValues) => {
      return formik.errors[fieldName] && formik.touched[fieldName]
        ? colors.error
        : colors.secondary;
    },
    [formik.errors, formik.touched],
  );

  // Memoized handlers to prevent unnecessary re-renders
  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Set a Password"
        subtitle="Create a strong password for your account and make sure to remember it."
      />
      <View style={styles.formContainer}>
        <Input
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          LeftAccessory={() => (
            <Ionicons
              name="lock-closed"
              size={26}
              color={getIconColor('password')}
              style={styles.icon}
            />
          )}
          RightAccessory={() => (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.iconButton}
            >
              <Ionicons
                name={passwordVisible ? 'eye' : 'eye-off'}
                size={26}
                color={colors.secondary}
              />
            </TouchableOpacity>
          )}
          value={formik.values.password}
          onChangeText={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
          error={formik.touched.password ? formik.errors.password : undefined}
        />

        <Input
          placeholder="Confirm Password"
          secureTextEntry={!confirmPasswordVisible}
          LeftAccessory={() => (
            <Ionicons
              name="lock-closed"
              size={26}
              color={getIconColor('confirmPassword')}
              style={styles.icon}
            />
          )}
          RightAccessory={() => (
            <TouchableOpacity
              onPress={toggleConfirmPasswordVisibility}
              style={styles.iconButton}
            >
              <Ionicons
                name={confirmPasswordVisible ? 'eye' : 'eye-off'}
                size={26}
                color={colors.secondary}
              />
            </TouchableOpacity>
          )}
          value={formik.values.confirmPassword}
          onChangeText={formik.handleChange('confirmPassword')}
          onBlur={formik.handleBlur('confirmPassword')}
          error={
            formik.touched.confirmPassword
              ? formik.errors.confirmPassword
              : undefined
          }
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
    gap: 10,
    flexDirection: 'column',
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
  },
  iconButton: {
    alignSelf: 'center',
    marginEnd: 12,
  },
});
