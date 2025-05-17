import React, { useCallback, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  InputAccessoryView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegistration } from '@/src/context/RegistrationContext';
import { useTheme } from '@/src/theme/ThemeContext';
import LockIcon from '@/src/icons/LockIcon';
import Identifier from '@/src/components/molecules/Indetfier/Identifier';
import { Button, Header, Input } from '@/src/components/atoms';
import { EcohInput } from '@/src/components/atoms/EcohInput/EcohInput';
import { parsePhoneNumberWithError } from 'libphonenumber-js';
import { ICountryCode } from '@/src/components/molecules/MobileNumber';
import { CountryCode } from 'libphonenumber-js/types';
import * as Localization from 'expo-localization';
import { countryMap } from '@/src/lib/countryMap';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '@/src/theme/typography';

interface FormValues {
  email: string;
  mobile: string;
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

const getInitialCountry = (): ICountryCode => {
  const region = Localization.getLocales()[0].regionCode || 'GB';
  return countryMap[region] || countryMap['GB'];
};

const PasswordTipBar = () => (
  <View style={styles.tipBar}>
    <Text style={styles.tipText}>
      Use 8+ characters with uppercase, lowercase, number, and symbol.
    </Text>
  </View>
);

const inputAccessoryViewID = 'uniqueID';

// 🧠 Component
export default function Security() {
  const { colors } = useTheme();
  const { handleSubmitStep, isSubmitting } = useRegistration();

  const [isEmail, setIsEmail] = useState(false);
  const [mobileCountry, setMobileCountry] = useState<ICountryCode>(() =>
    getInitialCountry(),
  );

  const emailRef = useRef<TextInput>(null);
  const mobileRef = useRef<TextInput>(null);

  const getValidationSchema = (isEmail: boolean, country: CountryCode) =>
    Yup.object().shape({
      email: isEmail
        ? Yup.string().email('Invalid email').required('Email is required')
        : Yup.string(),
      mobile: isEmail
        ? Yup.string()
        : Yup.string()
            .required('Mobile number is required')
            .test('is-valid-mobile', 'Enter a valid mobile number', (value) => {
              if (!value) return false;
              try {
                const parsed = parsePhoneNumberWithError(value, country);
                return parsed.isValid() && parsed.getType() === 'MOBILE';
              } catch {
                return false;
              }
            }),
      password: passwordSchema.fields.password,
      confirmPassword: passwordSchema.fields.confirmPassword,
    });

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: getValidationSchema(isEmail, mobileCountry.country),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleSubmitStep(
          getValidationSchema(isEmail, mobileCountry.country),
          ['identifier', 'password'],
          {
            identifier: isEmail ? values.email : values.mobile,
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
    validateOnBlur: false,
  });

  const toggleInputMode = useCallback(() => {
    setIsEmail((prev) => !prev);
  }, [formik]);

  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.formContainer}>
        <Header
          title="Your security"
          subtitle="Set up how you'll sign in and keep your account protected."
          icon={<LockIcon size={32} color={colors.text} />}
        />

        <Identifier
          emailRef={emailRef}
          mobileRef={mobileRef}
          formik={formik}
          isEmail={isEmail}
          toggleInputMode={toggleInputMode}
          onCountryChange={(country) => setMobileCountry(country)}
        />

        <EcohInput
          label="Password"
          name="password"
          formik={formik}
          icon={(color) => <LockIcon size={24} color={color} />}
          secureTextEntry
          textContentType="password" // iOS + Android autofill context
          autoComplete="password" // Android + iOS 12+
          importantForAutofill="yes"
          inputAccessoryViewID={inputAccessoryViewID}
        />

        <EcohInput
          label="Confrim password"
          name="confirmPassword"
          formik={formik}
          icon={(color) => <LockIcon size={24} color={color} />}
          secureTextEntry
        />
      </View>

      <Button
        variant="primary"
        gradientColors={['#00c6ff', '#0072ff']}
        onPress={handleContinuePress}
        disabled={!formik.isValid || formik.isSubmitting}
        title={'Create Account'}
        size="large"
      />

      <InputAccessoryView nativeID={inputAccessoryViewID}>
        <View style={styles.tipBar}>
          <Text style={styles.tipText}>
            Use 8+ characters with uppercase, lowercase, number, and symbol.
          </Text>
        </View>
      </InputAccessoryView>
    </KeyboardAvoidingView>
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
    gap: 16,
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
  },
  iconButton: {
    alignSelf: 'center',
    marginEnd: 12,
  },
  tipBar: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  tipText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});
