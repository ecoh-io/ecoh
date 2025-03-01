import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import _ from 'lodash';
import { useRegistration } from '@/src/context/RegistrationContext';
import { useTheme } from '@/src/theme/ThemeContext';
import Input from '@/src/UI/Input';
import { Footer, Header, UsernameCheck } from '@/src/components/atoms';

interface FormValues {
  username: string;
}

const checkUsernameAvailability = async (
  username: string,
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
  return username !== 'test'; // Mocked API check: 'test' is taken
};

const usernameSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
});

export default function Username() {
  const { state, handleSubmitStep } = useRegistration();
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { colors } = useTheme();

  const formik = useFormik<FormValues>({
    initialValues: { username: state.formData.username },
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
          await handleSubmitStep(usernameSchema, ['username'], {
            username: values.username,
          });
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

  // Memoized handlers to prevent unnecessary re-renders
  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="What will your username be?"
        subtitle="Choose a unique username to be associated with your account."
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
    marginLeft: 6,
  },
  status: {
    alignSelf: 'center',
    marginRight: 6,
  },
});
