import { UsernameCheck } from '@/src/components/atoms';
import Header from '@/src/components/Profile/Edit/Header';
import { useEdit } from '@/src/context/EditContext';
import { useAuthStore } from '@/src/store/AuthStore';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import Input from '@/src/UI/Input';
import { MaterialIcons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import * as yup from 'yup';

interface FormValues {
  username: string;
}

const checkUsernameAvailability = async (
  username: string,
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
  return username !== 'test'; // Mocked API check: 'test' is taken
};

const usernameSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
});

const UserName: React.FC = () => {
  const { user, isLoading, updateUsername } = useEdit();
  const { colors } = useTheme();
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: { username: user?.username || '' },
    validationSchema: usernameSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values: FormValues, { setSubmitting, setErrors }) => {
      try {
        setIsChecking(true);
        const available = await checkUsernameAvailability(values.username);
        setIsAvailable(available);
        if (!available) {
          setErrors({ username: 'Username is already taken' });
        } else {
          updateUsername(values.username);
        }
      } catch (error) {
        console.error('Error checking username availability:', error);
      } finally {
        setIsChecking(false);
        setSubmitting(false);
      }
    },
  });

  // Refs to store latest values
  const setIsAvailableRef = useRef(setIsAvailable);
  const setIsCheckingRef = useRef(setIsChecking);
  const formikSetFieldErrorRef = useRef(formik.setFieldError);

  // Update refs on every render
  useEffect(() => {
    setIsAvailableRef.current = setIsAvailable;
    setIsCheckingRef.current = setIsChecking;
    formikSetFieldErrorRef.current = formik.setFieldError;
  });

  // Create the debounced function once
  const debouncedCheckAvailability = useRef(
    _.debounce(async (username: string) => {
      if (usernameSchema.isValidSync({ username })) {
        try {
          const available = await checkUsernameAvailability(username);
          setIsAvailableRef.current(available);
          if (!available) {
            formikSetFieldErrorRef.current(
              'username',
              'Username is already taken',
            );
          } else {
            formikSetFieldErrorRef.current('username', undefined);
          }
        } catch (error) {
          console.error('Error checking username availability:', error);
        } finally {
          setIsCheckingRef.current(false); // Ensure isChecking is set to false
        }
      } else {
        setIsAvailableRef.current(null);
        setIsCheckingRef.current(false); // Set isChecking to false if input is invalid
      }
    }, 500),
  ).current;

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedCheckAvailability.cancel();
    };
  }, [debouncedCheckAvailability]);

  // Handle username change
  const handleUsernameChange = useCallback(
    (text: string) => {
      formik.handleChange('username')(text);
      setIsAvailable(null);
      setIsChecking(true); // Set isChecking to true immediately
      debouncedCheckAvailability(text);
    },
    [debouncedCheckAvailability, formik.handleChange],
  );

  const iconColor = useMemo(() => {
    if (formik.errors.username) {
      return colors.error;
    }
    return colors.secondary;
  }, [formik.errors.username]);

  const RightAccessory = useCallback(() => {
    if (isChecking) {
      return (
        <ActivityIndicator
          size="small"
          color={colors.highlight}
          style={styles.status}
        />
      );
    }

    return null;
  }, [isChecking]);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title="Username"
        colors={colors}
        save={formik.handleSubmit}
        isSaving={isLoading}
        isDisabled={formik.isSubmitting || !formik.isValid}
      />
      <View style={styles.formContainer}>
        <View>
          <Input
            placeholder="Username"
            LeftAccessory={() => (
              <MaterialIcons
                name="alternate-email"
                size={26}
                color={iconColor}
                style={styles.icon}
              />
            )}
            RightAccessory={RightAccessory}
            value={formik.values.username}
            onChangeText={handleUsernameChange}
            onBlur={formik.handleBlur('username')}
            error={formik.touched.username ? formik.errors.username : undefined}
          />
          <UsernameCheck
            isAvailable={isAvailable}
            isChecking={isChecking}
            error={formik.errors.username}
          />
        </View>
      </View>
    </View>
  );
};

export default UserName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 20,
    paddingVertical: 15,
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
  },
  status: {
    alignSelf: 'center',
    marginRight: 6,
  },
});
