import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { StyleSheet, View } from 'react-native';
import _ from 'lodash';
import { useTheme } from '@/src/theme/ThemeContext';
import { useRegistration } from '@/src/context/RegistrationContext';
import IdentityIcon from '@/src/icons/IdentityIcon';
import NameIcon from '@/src/icons/NameIcon';
import UserNameIcon from '@/src/icons/UserNameIcon';
import DateOfBirth from '@/src/components/molecules/DateOfBirth';
import { Button, Header } from '@/src/components/atoms';
import UsernameAvailabilityIndicator from '@/src/components/atoms/UsernameAvailabilityIndicator';
import { EcohInput } from '@/src/components/atoms/EcohInput/EcohInput';
import { useUsernameAvailability } from '@/src/api/authentication/authenticationQuery';
import { useDebounce } from 'use-debounce';

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
      'You must be at least 16 years old to continue.',
    ),
});

const usernameSchema = validationSchema.fields.username as Yup.StringSchema;

interface FormValues {
  name: string;
  username: string;
  dateOfBirth: Date | null;
}

export default function Identity() {
  const { state, handleSubmitStep } = useRegistration();
  const { colors } = useTheme();
  const [fieldDirty, setFieldDirty] = useState<{ [key: string]: boolean }>({});

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
    validateOnBlur: false,
    validateOnChange: true,
  });

  const username = formik.values.username;
  const [debouncedUsername] = useDebounce(username, 500);
  const latestCheckedUsername = useRef('');

  const shouldCheck = debouncedUsername.length >= 3 && !formik.errors.username;
  const { data: isAvailable, isFetching } = useUsernameAvailability(
    debouncedUsername,
    shouldCheck,
  );

  // Whenever username changes, mark as dirty
  const handleUsernameChange = useCallback(
    (text: string) => {
      formik.setFieldValue('username', text);
      formik.setFieldTouched('username', true, false);
      markDirty('username');
    },
    [formik],
  );

  // If not available, set field error
  useEffect(() => {
    // Whenever the debouncedUsername changes, clear the error to prevent flicker
    if (shouldCheck) {
      formik.setFieldError('username', undefined);
    }
    // When the query completes, set error if not available
    if (shouldCheck && isAvailable === false) {
      formik.setFieldError('username', 'Username is already taken');
    }
    // If available, clear the error (only if it was from "already taken")
    if (shouldCheck && isAvailable === true) {
      if (formik.errors.username === 'Username is already taken') {
        formik.setFieldError('username', undefined);
      }
    }
  }, [debouncedUsername, isAvailable, shouldCheck]);

  const isDisabled =
    !formik.values.name ||
    !formik.values.username ||
    !formik.values.dateOfBirth;

  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  const markDirty = useCallback((name: string) => {
    setFieldDirty((prev) => ({ ...prev, [name]: true }));
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Header
          title="Your identity"
          subtitle="Start shaping your identity with your name and a unique username"
          icon={<IdentityIcon size={32} color={colors.text} />}
        />

        <EcohInput
          label="Name"
          name="name"
          formik={formik}
          dirty={!!fieldDirty['name']}
          onChangeText={(text) => {
            formik.setFieldValue('name', text);
            markDirty('name');
          }}
          icon={(color) => <NameIcon size={24} color={color} />}
          helperText="How you’ll appear on your profile."
        />

        <EcohInput
          label="Username"
          name="username"
          formik={formik}
          dirty={!!fieldDirty['username']}
          onChangeText={(text) => {
            handleUsernameChange(text);
          }}
          icon={(color) => <UserNameIcon size={24} color={color} />}
          rightAccessory={
            <UsernameAvailabilityIndicator
              isAvailable={isAvailable}
              isChecking={isFetching}
              error={
                formik.touched.username && !!fieldDirty['username']
                  ? formik.errors.username
                  : undefined
              }
              value={formik.values.username}
            />
          }
          helperText="How others find you on Ecoh"
        />

        <DateOfBirth
          label="Date of Birth"
          value={formik.values.dateOfBirth}
          onChange={(date) => formik.setFieldValue('dateOfBirth', date)}
          error={
            formik.touched.dateOfBirth ? formik.errors.dateOfBirth : undefined
          }
          helperText="Used to verify your age. It won’t appear on your profile"
          setFieldError={formik.setFieldError}
          setFieldTouched={formik.setFieldTouched}
        />
      </View>

      <Button
        variant="primary"
        gradientColors={['#00c6ff', '#0072ff']}
        onPress={handleContinuePress}
        disabled={formik.isSubmitting || isDisabled}
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
    gap: 21,
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
