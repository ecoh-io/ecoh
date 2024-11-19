import Button from '@/src/UI/Button';
import Input from '@/src/UI/Input';
import MobileNumberInput from '@/src/UI/MobileNumberInput';
import { ICountryCode } from '@/src/UI/MobileNumberInput/MobileNumberInput';
import { Footer, Header } from '@/src/components/atoms';
import { useRegistration } from '@/src/context/RegistrationContext';
import { useRegisterUser } from '@/src/hooks/useRegisterUser';
import { useTheme } from '@/src/theme/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFormik } from 'formik';
import { CountryCode } from 'libphonenumber-js/types';
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';
import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import * as yup from 'yup';
import { typography } from '@/src/theme/typography';

// Validation schema using Yup
const emailSchema = yup
  .string()
  .email('Invalid email address')
  .required('Email is required');

// Mobile number validation schema as a function to accept dynamic country codes
const mobileSchema = (countryCode: CountryCode) =>
  yup
    .string()
    .required('Mobile number is required')
    .test('is-valid-mobile', 'Invalid mobile number', function (value) {
      if (!value) return false;
      try {
        const phoneNumber = parsePhoneNumber(value, countryCode);
        return phoneNumber.isValid();
      } catch {
        return false;
      }
    });

interface FormValues {
  identifier: string;
}

export default function Identifier() {
  const { state, handleSubmitStep } = useRegistration();
  const { colors } = useTheme();
  const [isEmail, setIsEmail] = useState<Boolean>(false);
  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<ICountryCode>({
    code: '+44',
    flag: '🇬🇧',
    country: 'GB',
  });
  const emailRef = useRef<TextInput>(null);
  const mobileRef = useRef<TextInput>(null);

  const validationSchema = isEmail
    ? emailSchema
    : mobileSchema(countryCode.country);

  // Formik setup using the useFormik hook
  const formik = useFormik({
    initialValues: { identifier: '' },
    validationSchema: validationSchema,
    onSubmit: async (
      values: FormValues,
      { setSubmitting, setErrors, setStatus },
    ) => {
      try {
        const registrationData = {
          identifier: values.identifier,
          password: state.formData.password,
        };

        await mutateAsync(registrationData);

        await handleSubmitStep(
          validationSchema,
          ['identifier'],
          registrationData,
        );
      } catch (error: any) {
        if (error.response?.data?.errors) {
          const fieldErrors = error.response.data.errors;
          setErrors(fieldErrors);
        } else if (error.response?.data?.message) {
          setStatus({ formError: error.response.data.message });
        } else {
          setStatus({
            formError: 'An unexpected error occurred. Please try again.',
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
    validateOnChange: false,
    validateOnBlur: true,
  });

  const { mutateAsync } = useRegisterUser({
    onError: (error: any) => {
      if (error?.status === 409) {
        formik.setErrors({ identifier: 'Identifier is already in use' });
      } else {
        formik.setStatus({
          formError: 'Registration failed. Please try again.',
        });
      }
    },
  });

  const iconColor = useMemo(() => {
    if (formik.errors.identifier && formik.touched.identifier) {
      return colors.error;
    }
    return colors.secondary;
  }, [formik.errors.identifier, formik.touched.identifier, colors]);

  const toggleInputMode = useCallback(() => {
    formik.setFieldValue('identifier', '');
    formik.setFieldError('identifier', '');
    setIsEmail((prev) => !prev);
  }, [formik]);

  // Handle country code picker visibility
  const handleCountryCodePress = useCallback(() => {
    mobileRef.current?.blur();
    setShowCountryPicker(true);
  }, []);

  const handleCountrySelect = useCallback(
    (country: ICountryCode) => {
      setCountryCode(country);
      setShowCountryPicker(false);
      // Re-validate the mobile number with the new country code
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
      const formattedNumber = formatPhoneNumber(text);
      formik.setFieldValue('identifier', formattedNumber);
    },
    [formatPhoneNumber, formik],
  );

  // Format phone number as user types

  const IdentifierInput = () => {
    if (isEmail) {
      return (
        <>
          <Input
            ref={emailRef}
            placeholder="Email"
            LeftAccessory={() => (
              <Ionicons
                name="mail"
                size={26}
                color={iconColor}
                style={styles.icon}
              />
            )}
            value={formik.values.identifier}
            onChangeText={formik.handleChange('identifier')}
            onBlur={formik.handleBlur('identifier')}
            keyboardType="email-address"
            autoCapitalize="none"
            error={
              formik.touched.identifier ? formik.errors.identifier : undefined
            }
          />
          <Button
            variant="secondary"
            onPress={toggleInputMode}
            title="Continue with mobile"
            size="large"
          />
        </>
      );
    } else {
      return (
        <>
          <MobileNumberInput
            value={formik.values.identifier}
            countryCode={countryCode}
            onCountryCodePress={handleCountryCodePress}
            onChangeText={(text) => handleMobileChange(text)}
            onBlur={formik.handleBlur('identifier')}
            error={
              formik.touched.identifier ? formik.errors.identifier : undefined
            }
          />
          <Button
            variant="secondary"
            onPress={toggleInputMode}
            title="Continue with email"
            size="large"
          />
        </>
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={isEmail ? "What's your email?" : "What's your mobile number?"}
        subtitle={
          isEmail
            ? 'Enter the email on which you can be contacted. No one will see this on your profile.'
            : 'Enter the mobile number on which you can be contacted. No one will see this on your profile.'
        }
      />
      <View style={styles.formContainer}>
        <IdentifierInput />
      </View>
      <CountryPicker
        lang="en"
        show={showCountryPicker}
        onBackdropPress={() => setShowCountryPicker(false)}
        style={{
          modal: {
            height: 700,
          },
          line: {
            opacity: 0,
          },
          textInput: {
            padding: 16,
            height: 52,
            backgroundColor: colors.background,
            borderWidth: 2,
            borderRadius: 12,
            borderColor: colors.secondary,
            fontFamily: typography.Poppins.medium,
          },
          countryButtonStyles: {
            height: 52,
            backgroundColor: colors.secondary,
            marginBottom: 8,
          },
          dialCode: {
            fontFamily: typography.Poppins.medium,
          },
          countryName: { fontFamily: typography.Poppins.medium },
        }}
        pickerButtonOnPress={(item) => {
          handleCountrySelect({
            code: item.dial_code,
            flag: item.flag,
            country: item.code as CountryCode,
          });
        }}
      />
      <Footer
        onPress={formik.handleSubmit}
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
    gap: 15,
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
    opacity: 1,
  },
});
