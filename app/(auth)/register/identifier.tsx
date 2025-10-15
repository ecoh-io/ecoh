import { Button, Header } from '@/src/components/atoms';
import MobileNumber, {
  ICountryCode,
} from '@/src/components/molecules/MobileNumber';
import LockIcon from '@/src/icons/LockIcon';
import { useTheme } from '@/src/theme/ThemeContext';
import { useFormik } from 'formik';
import { CountryCode, parsePhoneNumberWithError } from 'libphonenumber-js';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import * as Localization from 'expo-localization';
import { countryMap } from '@/src/lib/countryMap';
import { useRegistration } from '@/src/context/RegistrationContext';
import MailIcon from '@/src/icons/MailIcon';

interface FormValues {
  email: string;
  mobile: string;
}

const getInitialCountry = (): ICountryCode => {
  const region = Localization.getLocales()[0].regionCode || 'GB';
  return countryMap[region] || countryMap['GB'];
};

export default function Identifier() {
  const { state, handleSubmitStep } = useRegistration();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [mobileCountry, setMobileCountry] = useState<ICountryCode>(() =>
    getInitialCountry(),
  );

  const scrollViewRef = useRef<any>(null);

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
    });

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      mobile: '',
    },
    validationSchema: getValidationSchema(false, mobileCountry.country),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleSubmitStep(
          getValidationSchema(false, mobileCountry.country),
          ['identifier'],
          {
            identifier: values.mobile,
          },
        );
      } catch (error) {
        console.error('Error submitting password:', error);
      } finally {
        setSubmitting(false);
      }
    },
    validateOnBlur: false,
    validateOnChange: true,
  });

  const isDisabled = !formik.values.mobile;

  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={insets.bottom + 210}
      >
        <View style={styles.formContainer}>
          <Header
            title="Sign-in method"
            subtitle="Choose how you'll sign in and keep your account secure."
            icon={<LockIcon size={32} color={colors.text} />}
          />

          <MobileNumber
            label="Mobile Number"
            name="mobile"
            formik={formik}
            initialCountry="GB"
            onCountryChange={(country) => setMobileCountry(country)}
          />
          <Button
            variant="secondary"
            onPress={() => {}}
            title={'Continue with email address'}
            size="large"
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.buttonBar}>
        <Button
          variant="primary"
          gradientColors={['#00c6ff', '#0072ff']}
          onPress={handleContinuePress}
          disabled={formik.isSubmitting || isDisabled}
          title={'Continue'}
          size="large"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    marginTop: 14,
    justifyContent: 'flex-start',
  },
  formContainer: {
    flexGrow: 1,
    gap: 26,
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
  },
  status: {
    alignSelf: 'center',
    marginEnd: 6,
  },
  buttonBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
