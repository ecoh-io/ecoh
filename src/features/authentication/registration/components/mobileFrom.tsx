import { useTheme } from '@/src/theme/ThemeContext';
import { useMobileForm } from '../hooks/useMobileForm';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Header } from '@/src/components/atoms';
import { MobileInput } from '@/src/components/ui/inputs/mobile';
import {
  KeyboardAvoidingView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { Feather, FontAwesome6, Octicons } from '@expo/vector-icons';
import GoogleIcon from '@/src/components/ui/icons/GoogleIcon';
import { useRouter } from 'expo-router';
import MailIcon from '@/src/components/ui/icons/MailIcon';

const { height } = Dimensions.get('window');

function MobileFrom() {
  const { colors } = useTheme();
  const { formik, setMobileCountry, isFormIncomplete } = useMobileForm();
  const router = useRouter();

  const isSmallScreen = height < 700;

  // Small devices need more lift, large ones barely any
  const keyboardVerticalOffset = Platform.select({
    ios: isSmallScreen ? 65 : -100,
    android: 0,
  });

  const onPressApple = () => {
    // TODO: trigger Apple SSO
  };

  const onPressGoogle = () => {
    // TODO: trigger Google SSO
  };

  const onPressEmail = () => {
    router.replace('/(auth)/register/email');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'position' : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={styles.contentContainer}>
          <Header
            title="Sign-In"
            subtitle="Continue shaping your identity with your preferred sign-in method."
            icon={
              <Octicons
                name="sign-in"
                size={32}
                color={colors.text}
                style={{ transform: [{ rotate: '180deg' }] }}
              />
            }
          />
          <View style={styles.form}>
            <MobileInput
              label="Mobile Number"
              name="mobile"
              formik={formik}
              initialCountry="GB"
              onCountryChange={(country) => setMobileCountry(country)}
              helperText="We'll send a verification code to this number"
            />
            <View style={styles.orContainer}>
              <View
                style={[styles.line, { backgroundColor: colors.default }]}
              />
              <Text style={[styles.orText, { color: colors.default }]}>OR</Text>
              <View
                style={[styles.line, { backgroundColor: colors.default }]}
              />
            </View>
            <View style={styles.ssoRow}>
              <TouchableOpacity
                onPress={onPressGoogle}
                activeOpacity={0.8}
                accessibilityLabel="Continue with Google"
                style={[styles.circle, styles.googleCircle]}
              >
                <GoogleIcon size={24} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onPressApple}
                activeOpacity={0.8}
                accessibilityLabel="Continue with Apple"
                style={[styles.circle, styles.appleCircle]}
              >
                <FontAwesome6 name="apple" size={24} color="black" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onPressEmail}
                activeOpacity={0.8}
                accessibilityLabel="Continue with Email"
                style={[styles.circle, styles.emailCircle]}
              >
                <MailIcon size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <KeyboardStickyView
        offset={{ opened: 0, closed: 0 }}
        style={[styles.buttonContainer, { backgroundColor: colors.background }]}
      >
        <Button
          variant="primary"
          gradientColors={['#00c6ff', '#0072ff']}
          onPress={formik.handleSubmit}
          disabled={formik.isSubmitting || isFormIncomplete}
          title="Continue"
          size="large"
        />
      </KeyboardStickyView>
    </View>
  );
}

export default MobileFrom;

const CIRCLE_SIZE = 52;

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
    marginVertical: 16,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  line: {
    flex: 1,
    height: 1,
    opacity: 1,
  },
  orText: {
    fontSize: 14,
    fontWeight: '500',

    opacity: 0.7,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleCircle: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  googleCircle: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  emailCircle: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  // SSO cubes
  ssoRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 26,
  },
  cube: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 8,
    gap: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cubeGoogle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  cubeApple: {
    backgroundColor: '#000',
  },
  ssoText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  ssoTextApple: {
    color: '#fff',
  },
});
