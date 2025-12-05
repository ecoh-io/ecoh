import { Button, Header } from '@/src/components/atoms';
import IdentityIcon from '@/src/components/ui/icons/IdentityIcon';
import LockIcon from '@/src/components/ui/icons/LockIcon';
import { Input } from '@/src/components/ui/inputs/input';
import { useTheme } from '@/src/theme/ThemeContext';
import {
  Dimensions,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { useSecurityForm } from '../hooks/useSecurityForm';
import { useRef } from 'react';

const { height } = Dimensions.get('window');

function SecurityForm() {
  const { colors } = useTheme();
  const { formik, isDisabled, fieldDirty, markDirty } = useSecurityForm();

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const isSmallScreen = height < 700;

  // Small devices need more lift, large ones barely any
  const keyboardVerticalOffset = Platform.select({
    ios: isSmallScreen ? 15 : -100,
    android: 0,
  });
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'position' : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={styles.contentContainer}>
          <Header
            title="Security"
            subtitle="Set your password and complete your account setup securely."
            icon={<LockIcon size={32} color={colors.text} />}
          />
          <View style={styles.form}>
            <Input
              ref={passwordRef}
              label="Password"
              name="password"
              formik={formik}
              dirty={!!fieldDirty['password']}
              onChangeText={(text) => {
                formik.setFieldValue('password', text);
                markDirty('password');
              }}
              secureTextEntry
              textContentType="oneTimeCode"
              autoComplete="off"
              autoCorrect={false}
              importantForAutofill="no"
              helperText="8+ characters, upper & lowercase, numbers, and symbols."
            />

            <Input
              ref={confirmPasswordRef}
              label="Confrim password"
              name="confirmPassword"
              formik={formik}
              dirty={!!fieldDirty['confirmPassword']}
              onChangeText={(text) => {
                formik.setFieldValue('confirmPassword', text);
                markDirty('confirmPassword');
              }}
              secureTextEntry
              textContentType="oneTimeCode"
              autoComplete="off"
              autoCorrect={false}
              importantForAutofill="no"
              enablesReturnKeyAutomatically={false}
              helperText="Re-enter your password to make sure it matches."
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      <KeyboardStickyView
        offset={{ opened: 0, closed: 0 }}
        style={styles.buttonContainer}
      >
        <Button
          variant="primary"
          gradientColors={['#00c6ff', '#0072ff']}
          onPress={formik.handleSubmit}
          disabled={formik.isSubmitting || isDisabled}
          title="Continue"
          size="large"
        />
      </KeyboardStickyView>
    </View>
  );
}

export default SecurityForm;

const styles = StyleSheet.create({
  root: {
    flex: 1, // ensures full screen height
    justifyContent: 'space-between', // keeps sticky area at bottom
  },
  flex: {
    flexGrow: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 26,
  },
  form: {
    flexShrink: 0,
    gap: 26,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
