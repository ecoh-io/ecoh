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
import { AsYouType, parsePhoneNumberWithError } from 'libphonenumber-js';
import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import * as yup from 'yup';
import { typography } from '@/src/theme/typography';
import IdentifierInput from '@/src/UI/IdentifierInput';

// Validation schema using Yup
const emailSchema = yup.object().shape({
  identifier: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
});

// Mobile number validation schema as a function to accept dynamic country codes
const mobileSchema = (countryCode: CountryCode) =>
  yup.object().shape({
    identifier: yup
      .string()
      .required('Mobile number is required')
      .test('is-valid-mobile', 'Invalid mobile number', function (value) {
        if (!value) return false;
        try {
          const phoneNumber = parsePhoneNumberWithError(value, countryCode);
          return phoneNumber.isValid();
        } catch {
          return false;
        }
      }),
  });

interface FormValues {
  identifier: string;
}

export default function Identifier() {
  const { state, handleSubmitStep } = useRegistration();
  const { colors } = useTheme();
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<ICountryCode>({
    code: '+44',
    flag: '🇬🇧',
    country: 'GB',
  });
  const emailRef = useRef<TextInput>(null);
  const mobileRef = useRef<TextInput>(null);

  const validationSchema = useMemo(() => {
    return isEmail ? emailSchema : mobileSchema(countryCode.country);
  }, [isEmail, countryCode]);

  const { mutateAsync } = useRegisterUser({
    onError: (error) => {
      if (error?.status === 409) {
        formik.setErrors({
          identifier: isEmail
            ? 'Email is already in use'
            : 'Mobile number is already in use',
        });
      } else {
        console.log({ error });
        formik.setStatus({
          formError: 'Registration failed. Please try again.',
        });
      }
    },
  });

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
          isEmail,
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
    enableReinitialize: true,
  });

  const iconColor = useMemo(() => {
    if (formik.errors.identifier && formik.touched.identifier) {
      return colors.error;
    }
    return colors.secondary;
  }, [formik.errors.identifier, formik.touched.identifier, colors]);

  const toggleInputMode = useCallback(() => {
    formik.resetForm();
    setIsEmail((prev) => !prev);
  }, [formik, setIsEmail]);

  // Handle country code picker visibility
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
      const formattedNumber = formatPhoneNumber(text);
      formik.setFieldValue('identifier', formattedNumber);
    },
    [formatPhoneNumber, formik],
  );

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
        <IdentifierInput
          countryCode={countryCode}
          emailRef={emailRef}
          formik={formik}
          handleCountryCodePress={handleCountryCodePress}
          handleMobileChange={handleMobileChange}
          iconColor={iconColor}
          isEmail={isEmail}
          mobileRef={mobileRef}
          toggleInputMode={toggleInputMode}
        />
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
            fontFamily: typography.fontFamilies.poppins.regular,
          },
          countryButtonStyles: {
            height: 52,
            backgroundColor: colors.secondary,
            marginBottom: 8,
          },
          dialCode: {
            fontFamily: typography.fontFamilies.poppins.medium,
          },
          countryName: { fontFamily: typography.fontFamilies.poppins.medium },
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
    flexDirection: 'column',
    gap: 15,
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
    opacity: 1,
  },
});
