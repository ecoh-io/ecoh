import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { useLoginUser } from '@/src/api/authentication/useAuthenticationMutations';
import MailIcon from '@/src/icons/MailIcon';
import LockIcon from '@/src/icons/LockIcon';
import AccountIcon from '@/src/icons/AccountIcon';
import Button from '@/src/components/atoms/Button';
import Input from '@/src/components/atoms/Input';
import { Header } from '@/src/components/atoms';

interface FormValues {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

const loginSchema = Yup.object().shape({
  identifier: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { colors } = useTheme();

  // Animation for error message
  const [errorOpacity] = useState(new Animated.Value(0));

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: { identifier: '', password: '', rememberMe: false },
    validationSchema: loginSchema,
    onSubmit: async (values: FormValues) => {
      try {
        const loginData = {
          identifier: values.identifier,
          password: values.password,
        };
        await mutateAsync(loginData);
      } catch (err) {
        console.error('Error logging in:', err);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const { mutateAsync, isPending } = useLoginUser({
    onError: (error) => {
      if (error?.status === 401) {
        setError('Incorrect email or password');
      } else {
        setError('Login failed. Please try again.');
      }
      // Animate error message appearance
      Animated.timing(errorOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    },
  });

  const getIconColor = useCallback(
    (fieldName: keyof FormValues) => {
      return formik.errors[fieldName] && formik.touched[fieldName]
        ? colors.error
        : colors.secondary;
    },
    [formik.errors, formik.touched, colors.error, colors.secondary],
  );

  // Memoized handlers to prevent unnecessary re-renders
  const handleSignInPress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  const handleForgotPassword = useCallback(() => {
    Alert.alert('Forgot Password', 'Navigate to Forgot Password screen');
  }, []);

  const renderErrorMessage = useMemo(() => {
    if (!error) return null;
    return (
      <Animated.View
        style={[
          styles.errorContainer,
          { backgroundColor: 'rgba(193, 28, 50, 0.3)', opacity: errorOpacity },
        ]}
      >
        <Ionicons
          name="information-circle-outline"
          size={24}
          color={colors.error}
          accessibilityLabel="Error Icon"
        />
        <Text
          style={[
            styles.errorText,
            {
              color: colors.error,
              fontFamily: typography.fontFamilies.poppins.medium,
            },
          ]}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      </Animated.View>
    );
  }, [error, colors.error, colors.error, errorOpacity]);

  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [formik.values.identifier, formik.values.password]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Header
          title="Sign in to your account"
          subtitle="Enter your email or mobile number to access your account."
          icon={<AccountIcon size={32} color={colors.text} />}
        />

        {/* Email Input */}
        <Input
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={formik.values.identifier}
          onChangeText={formik.handleChange('identifier')}
          onBlur={formik.handleBlur('identifier')}
          error={
            formik.touched.identifier ? formik.errors.identifier : undefined
          }
          LeftAccessory={() => (
            <View style={styles.icon}>
              <MailIcon size={24} color={colors.secondary} />
            </View>
          )}
          accessibilityLabel="Email Input"
        />

        {/* Password Input */}
        <Input
          placeholder="Password"
          autoCapitalize="none"
          autoCorrect={false}
          value={formik.values.password}
          onChangeText={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
          error={formik.touched.password ? formik.errors.password : undefined}
          secureTextEntry={!showPassword}
          LeftAccessory={() => (
            <View style={styles.icon}>
              <LockIcon size={24} color={colors.secondary} />
            </View>
          )}
          RightAccessory={() => (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.iconButton}
              accessibilityLabel={
                showPassword ? 'Hide Password' : 'Show Password'
              }
              accessible
            >
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color={colors.secondary}
              />
            </TouchableOpacity>
          )}
          accessibilityLabel="Password Input"
        />

        {renderErrorMessage}
        {/* Sign In Button */}
        <View style={{ flexDirection: 'column', gap: 14 }}>
          {/* Forgot Password */}
          <Button
            variant="secondary"
            size="large"
            onPress={handleForgotPassword}
            title="Forgot Password?"
            accessibilityLabel="Forgot Password Button"
          />
        </View>
      </View>
      <Button
        variant="primary"
        gradientColors={['#00c6ff', '#0072ff']}
        onPress={handleSignInPress}
        disabled={!formik.isValid || formik.isSubmitting || isPending}
        loading={formik.isSubmitting || isPending}
        title="Sign In"
        size="large"
        accessibilityLabel="Sign In Button"
      />
    </View>
  );
};

export default React.memo(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: typography.fontSizes.title,
    fontFamily: typography.fontFamilies.poppins.bold,
    marginTop: 12,
  },
  formContainer: {
    flex: 1,
    gap: 20,
  },
  icon: {
    alignSelf: 'center',
    marginStart: 8,
  },
  iconButton: {
    alignSelf: 'center',
    marginEnd: 16,
  },
  errorContainer: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#F56565',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  socialContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  orText: {
    fontSize: 16,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: typography.fontSizes.body,
  },
  logo: {
    width: 40,
    height: 40,
  },
});
