import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegistration } from '@/src/context/RegistrationContext';
import { useTheme } from '@/src/theme/ThemeContext';
import LockIcon from '@/src/icons/LockIcon';
import { AsYouType, parsePhoneNumberWithError } from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js/types';
import PasswordStrength from '@/src/components/molecules/PasswordStrength';
import { ICountryCode } from '@/src/components/molecules/MobileNumber';
import Identifier from '@/src/components/molecules/Indetfier/Identifier';
import { Button, Header, Input } from '@/src/components/atoms';

interface FormValues {
  identifier: string;
  password: string;
  confirmPassword: string;
}

// 🔐 Validation Schemas
const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain a lowercase letter')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/\d/, 'Must contain a number')
    .matches(/[@$!%*#?&]/, 'Must contain a special character'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

const mobileSchema = (countryCode: CountryCode) =>
  Yup.object().shape({
    identifier: Yup.string()
      .required('Mobile number is required')
      .test('is-valid-mobile', 'Invalid mobile number', (value) => {
        if (!value) return false;
        try {
          return parsePhoneNumberWithError(value, countryCode).isValid();
        } catch {
          return false;
        }
      }),
  });

const emailSchema = Yup.object().shape({
  identifier: Yup.string().email('Invalid email').required('Email is required'),
});

// 🧠 Component
export default function Security() {
  const { colors } = useTheme();
  const { handleSubmitStep, isSubmitting } = useRegistration();

  const [isEmail, setIsEmail] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState<ICountryCode>({
    code: '+44',
    flag: '🇬🇧',
    country: 'GB',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const mobileRef = useRef<TextInput>(null);

  const combinedSchema = (isEmail: boolean, country: CountryCode) =>
    Yup.object().shape({
      identifier: isEmail
        ? emailSchema.fields.identifier
        : mobileSchema(country).fields.identifier,
      password: passwordSchema.fields.password,
      confirmPassword: passwordSchema.fields.confirmPassword,
    });

  const formik = useFormik<FormValues>({
    initialValues: {
      identifier: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: combinedSchema(isEmail, countryCode.country),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleSubmitStep(
          combinedSchema(isEmail, countryCode.country),
          ['identifier', 'password'],
          {
            identifier: values.identifier,
            password: values.password,
          },
        );
      } catch (error) {
        console.error('Error submitting password:', error);
      } finally {
        setSubmitting(false);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // 🔁 Memoized Handlers
  const toggleInputMode = useCallback(() => {
    formik.resetForm();
    setIsEmail((prev) => !prev);
  }, [formik]);

  const handleCountryCodePress = useCallback(() => {
    mobileRef.current?.blur();
    setShowCountryPicker(true);
  }, []);

  const handleCountrySelect = useCallback(
    (country: ICountryCode) => {
      setCountryCode(country);
      setShowCountryPicker(false);
      formik.validateField('identifier');
    },
    [formik],
  );

  const formatPhoneNumber = useCallback(
    (value: string) => {
      if (value.includes('(') && !value.includes(')')) {
        return value.replace('(', '');
      }
      return new AsYouType(countryCode.country as CountryCode).input(value);
    },
    [countryCode.country],
  );

  const handleMobileChange = useCallback(
    (text: string) => {
      const formatted = formatPhoneNumber(text);
      formik.setFieldValue('identifier', formatted);
    },
    [formatPhoneNumber, formik],
  );

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setConfirmPasswordVisible((prev) => !prev);
  }, []);

  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  const getIconColor = useCallback(
    (field: keyof FormValues) => {
      return formik.errors[field] && formik.touched[field]
        ? colors.error
        : colors.secondary;
    },
    [formik.errors, formik.touched, colors],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Header
          title="Your security"
          subtitle="Set your login and password details to keep your Ecoh account safe and secure."
          icon={<LockIcon size={32} color={colors.text} />}
        />

        <Identifier
          countryCode={countryCode}
          emailRef={emailRef}
          mobileRef={mobileRef}
          formik={formik}
          isEmail={isEmail}
          iconColor={getIconColor('identifier')}
          handleCountryCodePress={handleCountryCodePress}
          handleMobileChange={handleMobileChange}
          toggleInputMode={toggleInputMode}
          handleCountrySelect={handleCountrySelect}
          showCountryPicker={showCountryPicker}
          setShowCountryPicker={setShowCountryPicker}
        />

        <View style={{ flexDirection: 'column', gap: 8 }}>
          <Input
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
            error={formik.touched.password ? formik.errors.password : undefined}
            LeftAccessory={() => (
              <View style={styles.icon}>
                <LockIcon size={24} color={getIconColor('password')} />
              </View>
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
          />

          <View style={{ width: '50%' }}>
            <PasswordStrength password={formik.values.password} />
          </View>
        </View>

        <Input
          placeholder="Confirm Password"
          secureTextEntry={!confirmPasswordVisible}
          value={formik.values.confirmPassword}
          onChangeText={formik.handleChange('confirmPassword')}
          onBlur={formik.handleBlur('confirmPassword')}
          error={
            formik.touched.confirmPassword
              ? formik.errors.confirmPassword
              : undefined
          }
          LeftAccessory={() => (
            <View style={styles.icon}>
              <LockIcon size={24} color={getIconColor('confirmPassword')} />
            </View>
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
        />
      </View>

      <Button
        variant="primary"
        gradientColors={['#00c6ff', '#0072ff']}
        onPress={handleContinuePress}
        disabled={!formik.isValid || formik.isSubmitting}
        title={'Confirm'}
        size="large"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 14,
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
