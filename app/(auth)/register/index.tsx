import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { StyleSheet, View } from 'react-native';
import _ from 'lodash';
import { useTheme } from '@/src/theme/ThemeContext';
import { useRegistration } from '@/src/context/RegistrationContext';
import IdentityIcon from '@/src/icons/IdentityIcon';
import NameIcon from '@/src/icons/NameIcon';
import UserNameIcon from '@/src/icons/UserNameIcon';
import Input from '@/src/components/atoms/Input';
import DateOfBirth from '@/src/components/molecules/DateOfBirth';
import { Button, Header } from '@/src/components/atoms';
import UsernameAvailabilityIndicator from '@/src/components/atoms/UsernameAvailabilityIndicator';

const checkUsernameAvailability = async (
  username: string,
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated delay
  return username !== 'test'; // "test" is taken
};

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Too short')
    .max(32, 'Too long'),
  username: Yup.string().required('Username is required').min(3, 'Too short'),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 16)),
      'You must be at least 16 years old',
    ),
});

interface FormValues {
  name: string;
  username: string;
  dateOfBirth: Date | null;
}

export default function Identity() {
  const { state, handleSubmitStep } = useRegistration();
  const { colors } = useTheme();

  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: state.formData.name,
      username: state.formData.username,
      dateOfBirth: state.formData.dateOfBirth || null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleSubmitStep(
          validationSchema,
          ['name', 'username', 'dateOfBirth'],
          {
            name: values.name,
            username: values.username,
            dateOfBirth: values.dateOfBirth,
          },
        );
      } catch (error) {
        console.error('Error submitting name', error);
      } finally {
        setSubmitting(false);
      }
    },
    validateOnBlur: true,
    validateOnChange: false,
  });

  const nameIconColor = useMemo(
    () =>
      formik.errors.name && formik.touched.name
        ? colors.error
        : colors.secondary,
    [formik.errors.name, formik.touched.name],
  );

  const usernameIconColor = useMemo(
    () =>
      formik.errors.username && formik.touched.username
        ? colors.error
        : colors.secondary,
    [formik.errors.username, formik.touched.username],
  );

  const setIsAvailableRef = useRef(setIsAvailable);
  const setIsCheckingRef = useRef(setIsChecking);
  const setFieldErrorRef = useRef(formik.setFieldError);

  useEffect(() => {
    setIsAvailableRef.current = setIsAvailable;
    setIsCheckingRef.current = setIsChecking;
    setFieldErrorRef.current = formik.setFieldError;
  });

  const debouncedCheckAvailability = useRef(
    _.debounce(async (username: string) => {
      try {
        const available = await checkUsernameAvailability(username);
        setIsAvailableRef.current(available);

        if (!available) {
          setFieldErrorRef.current('username', 'Username is already taken');
        } else {
          setFieldErrorRef.current('username', undefined);
        }
      } catch {
        setIsAvailableRef.current(null);
      } finally {
        setIsCheckingRef.current(false);
      }
    }, 500),
  ).current;

  useEffect(() => {
    return () => debouncedCheckAvailability.cancel();
  }, []);

  const handleUsernameChange = useCallback(
    (text: string) => {
      formik.handleChange('username')(text);
      setIsAvailable(null);
      setIsChecking(true);
      debouncedCheckAvailability(text);
    },
    [formik],
  );

  useEffect(() => {
    console.log('Formik Errors:', formik.errors); // Add this line
  }, [formik.errors]);

  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Header
          title="Your identity"
          subtitle="Set a display name and unique username to represent you on Ecoh."
          icon={<IdentityIcon size={32} color={colors.text} />}
        />

        <Input
          placeholder="Name"
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
          error={formik.touched.name ? formik.errors.name : undefined}
          LeftAccessory={() => (
            <View style={styles.icon}>
              <NameIcon size={24} color={nameIconColor} />
            </View>
          )}
        />

        <Input
          placeholder="Username"
          value={formik.values.username}
          onChangeText={handleUsernameChange}
          onBlur={formik.handleBlur('username')}
          error={formik.touched.username ? formik.errors.username : undefined}
          LeftAccessory={() => (
            <View style={styles.icon}>
              <UserNameIcon size={24} color={usernameIconColor} />
            </View>
          )}
          RightAccessory={() => (
            <UsernameAvailabilityIndicator
              isAvailable={isAvailable}
              isChecking={isChecking}
              error={
                formik.touched.username ? formik.errors.username : undefined
              }
            />
          )}
        />

        <DateOfBirth
          value={formik.values.dateOfBirth}
          onChange={(date) => formik.setFieldValue('dateOfBirth', date)}
          error={
            formik.touched.dateOfBirth ? formik.errors.dateOfBirth : undefined
          }
          helperText="This won't be shown publicly"
          setFieldError={formik.setFieldError}
          setFieldTouched={formik.setFieldTouched}
        />
      </View>

      <Button
        variant="primary"
        gradientColors={['#00c6ff', '#0072ff']}
        onPress={handleContinuePress}
        disabled={!formik.isValid || formik.isSubmitting}
        title={'Continue'}
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
    gap: 14,
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
  },
  status: {
    alignSelf: 'center',
    marginEnd: 6,
  },
});
