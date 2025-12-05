import React, { useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Button, Header } from '@/src/components/atoms';
import IdentityIcon from '@/src/components/ui/icons/IdentityIcon';
import { useIdentityForm } from '../hooks/useIdentityForm';
import { Input } from '@/src/components/ui/inputs/input';
import {
  KeyboardAvoidingView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';

const { height } = Dimensions.get('window');

function IdentityForm() {
  const { colors } = useTheme();
  const {
    formik,
    fieldDirty,
    markDirty,
    handleUsernameChange,
    isAvailable,
    isFetching,
    isFormIncomplete,
  } = useIdentityForm();

  const nameInputRef = useRef<TextInput>(null);
  const usernameInputRef = useRef<TextInput>(null);

  const isSmallScreen = height < 700;

  // Small devices need more lift, large ones barely any
  const keyboardVerticalOffset = Platform.select({
    ios: isSmallScreen ? 15 : -130,
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
            title="Identity"
            subtitle="Shape your identity with your name and a unique username"
            icon={<IdentityIcon size={32} color={colors.text} />}
          />
          <View style={styles.form}>
            <Input
              ref={nameInputRef}
              label="Name"
              name="name"
              textContentType="name"
              formik={formik}
              dirty={!!fieldDirty['name']}
              onChangeText={(text) => {
                formik.setFieldValue('name', text);
                markDirty('name');
              }}
              helperText="Displayed on your profile and visible to others"
            />

            <Input
              ref={usernameInputRef}
              label="Username"
              name="username"
              textContentType="oneTimeCode"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              importantForAutofill="yes"
              formik={formik}
              dirty={!!fieldDirty['username']}
              onChangeText={handleUsernameChange}
              isChecking={isFetching}
              networkValid={isAvailable}
              helperText="Your unique handle for mentions and search"
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
          disabled={formik.isSubmitting || isFormIncomplete}
          title="Continue"
          size="large"
        />
      </KeyboardStickyView>
    </View>
  );
}

export default IdentityForm;

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
