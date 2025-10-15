import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegistration } from '@/src/context/RegistrationContext';
import { useTheme } from '@/src/theme/ThemeContext';
import LockIcon from '@/src/icons/LockIcon';
import { Button, Header } from '@/src/components/atoms';
import { EcohInput } from '@/src/components/atoms/EcohInput/EcohInput';
import { ICountryCode } from '@/src/components/molecules/MobileNumber';
import { typography } from '@/src/theme/typography';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FormValues {
  password: string;
  confirmPassword: string;
}

// 🔐 Validation Schemas
const securitySchema = Yup.object().shape({
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

export default function Security() {
  const { colors } = useTheme();
  const { handleSubmitStep, isSubmitting } = useRegistration();
  const [fieldDirty, setFieldDirty] = useState<{ [key: string]: boolean }>({});

  const emailRef = useRef<TextInput>(null);
  const mobileRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<any>(null);
  const insets = useSafeAreaInsets();

  const formik = useFormik<FormValues>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: securitySchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleSubmitStep(securitySchema, ['password'], {
          password: values.password,
        });
      } catch (error) {
        console.error('Error submitting password:', error);
      } finally {
        setSubmitting(false);
      }
    },
    validateOnBlur: false,
    validateOnChange: true,
  });

  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  const markDirty = useCallback((name: string) => {
    setFieldDirty((prev) => ({ ...prev, [name]: true }));
  }, []);

  const isDisabled = !formik.values.password || !formik.values.confirmPassword;

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
            title="Your security"
            subtitle="Set up how you'll sign in and keep your account protected."
            icon={<LockIcon size={32} color={colors.text} />}
          />

          <EcohInput
            label="Password"
            name="password"
            formik={formik}
            dirty={!!fieldDirty['password']}
            onChangeText={(text) => {
              formik.setFieldValue('password', text);
              markDirty('password');
            }}
            icon={(color) => <LockIcon size={24} color={color} />}
            secureTextEntry
            textContentType="password" // iOS + Android autofill context
            autoComplete="password" // Android + iOS 12+
            importantForAutofill="yes"
            helperText="8+ characters, upper & lowercase, numbers, and symbols."
          />

          <EcohInput
            label="Confrim password"
            name="confirmPassword"
            formik={formik}
            dirty={!!fieldDirty['confirmPassword']}
            onChangeText={(text) => {
              formik.setFieldValue('confirmPassword', text);
              markDirty('confirmPassword');
            }}
            icon={(color) => <LockIcon size={24} color={color} />}
            secureTextEntry
            showError={true}
          />
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.buttonBar}>
        <Button
          variant="primary"
          gradientColors={['#00c6ff', '#0072ff']}
          onPress={handleContinuePress}
          disabled={formik.isSubmitting || isDisabled}
          title={'Create Account'}
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
    paddingTop: 14,
    justifyContent: 'flex-start',
  },
  formContainer: {
    gap: 21,
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
  buttonBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
