// Input.tsx
import React, {
  useState,
  useCallback,
  useMemo,
  forwardRef,
  ReactElement,
  useEffect,
} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { InputProps } from './types';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { Entypo } from '@expo/vector-icons';
import { AnimatedWrapper } from '@/src/components/Animations/Animations';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface SocialMediaInputProps extends InputProps {
  /** Callback for when the send button is pressed.
   * Receives the current input value as a parameter.
   */
  onSend?: (value: string) => void;
  /** Show a live character counter (requires maxLength prop) */
  showCharacterCount?: boolean;
}

const Input = forwardRef<TextInput, SocialMediaInputProps>(
  (
    {
      label,
      error,
      helperText,
      placeholder,
      LeftAccessory,
      RightAccessory,
      secureTextEntry = false,
      secureTextEntryToggle = false,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      helperTextStyle,
      value = '',
      onChangeText,
      onFocus,
      onBlur,
      disabled,
      onSend,
      showCharacterCount = false,
      ...rest
    },
    ref,
  ): ReactElement => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(secureTextEntry);

    // Show clear button only when input is focused and nonempty.
    const clearButtonVisible = !disabled && isFocused && !!value.length;

    // Memoize focus and blur handlers.
    const handleFocus = useCallback(
      (e: any) => {
        setIsFocused(true);
        onFocus && onFocus(e);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: any) => {
        setIsFocused(false);
        onBlur && onBlur(e);
      },
      [onBlur],
    );

    // Toggle secure text visibility.
    const toggleSecureText = useCallback(() => {
      setIsSecure((prev) => !prev);
    }, []);

    // Compute the target halo border color.
    const computedBorderColor = useMemo(() => {
      if (error) return colors.error;
      if (isFocused) return colors.highlight;
      return colors.secondary;
    }, [error, isFocused, colors]);

    // Animate the halo’s border width.
    // We use a shared value (haloAnim) that interpolates from 0 (unfocused) to 1 (focused/error).
    // Then we compute borderWidth = 1 + haloAnim * 1 (i.e. 1 when unfocused, 2 when focused/error).
    const haloAnim = useSharedValue(0);
    useEffect(() => {
      haloAnim.value = withTiming(error || isFocused ? 1 : 0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
    }, [isFocused, error, haloAnim]);

    const animatedHaloStyle = useAnimatedStyle(() => {
      const borderWidth = haloAnim.value * 1 + 1; // from 1 to 2
      return { borderWidth };
    });

    // Calculate space for right-hand icons.
    const iconCount =
      (clearButtonVisible ? 1 : 0) +
      (secureTextEntryToggle ? 1 : 0) +
      (onSend || RightAccessory ? 1 : 0);
    const computedPaddingRight = 0 + iconCount * 32;

    // Build right-hand icons.
    const rightIcons = [];
    if (clearButtonVisible) {
      rightIcons.push(
        <AnimatedWrapper
          key="clear"
          visible={clearButtonVisible}
          animation="fade-in"
          exitAnimation="fade-out"
          duration={300}
        >
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onChangeText && onChangeText('')}
            accessibilityRole="button"
            accessibilityLabel="Clear text"
          >
            <Entypo
              name="cross"
              size={24}
              style={[styles.iconText, { color: colors.highlight }]}
            />
          </TouchableOpacity>
        </AnimatedWrapper>,
      );
    }
    if (secureTextEntryToggle) {
      rightIcons.push(
        <TouchableOpacity
          key="secure"
          style={styles.iconButton}
          onPress={toggleSecureText}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
        >
          <Text style={[styles.iconText, { color: colors.highlight }]}>
            {isSecure ? 'Show' : 'Hide'}
          </Text>
        </TouchableOpacity>,
      );
    } else if (onSend) {
      rightIcons.push(
        <TouchableOpacity
          key="send"
          style={styles.iconButton}
          onPress={() => onSend(value)}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Text style={[styles.sendText, { color: colors.highlight }]}>
            Send
          </Text>
        </TouchableOpacity>,
      );
    } else if (RightAccessory) {
      rightIcons.push(
        <RightAccessory
          key="right"
          style={styles.iconButton}
          editable={!disabled}
        />,
      );
    }

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: colors.text }, labelStyle]}>
            {label}
          </Text>
        )}
        {/* The inputWrapper is positioned relatively.
            The halo is rendered as an absolutely positioned Animated.View behind the input container.
            Negative offsets ensure the halo appears outside the input container without affecting its layout. */}
        <View style={styles.inputWrapper}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.halo,
              { borderColor: computedBorderColor },
              animatedHaloStyle,
            ]}
          />
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.background },
            ]}
          >
            {LeftAccessory && (
              <LeftAccessory
                style={styles.leftAccessory}
                editable={!disabled}
              />
            )}
            <TextInput
              ref={ref}
              style={[
                styles.input,
                inputStyle,
                { color: colors.text, paddingRight: computedPaddingRight },
              ]}
              onFocus={handleFocus}
              onBlur={handleBlur}
              secureTextEntry={
                secureTextEntryToggle ? isSecure : secureTextEntry
              }
              onChangeText={onChangeText}
              value={value}
              placeholder={isFocused ? undefined : placeholder}
              placeholderTextColor={error ? colors.error : colors.secondary}
              editable={!disabled}
              {...rest}
            />
            {rightIcons.map((icon) => icon)}
          </View>
        </View>
        {(error || helperText || (showCharacterCount && rest.maxLength)) && (
          <View style={styles.bottomRow}>
            <View style={{ flex: 1 }}>
              {error ? (
                <AnimatedWrapper
                  visible={!!error}
                  animation="fade-in"
                  exitAnimation="fade-out"
                  duration={300}
                >
                  <Text
                    style={[
                      styles.errorText,
                      errorStyle,
                      { color: colors.error },
                    ]}
                  >
                    {error}
                  </Text>
                </AnimatedWrapper>
              ) : (
                helperText && (
                  <Text
                    style={[
                      styles.helperText,
                      helperTextStyle,
                      { color: colors.placeholder },
                    ]}
                  >
                    {helperText}
                  </Text>
                )
              )}
            </View>
            {showCharacterCount && rest.maxLength && (
              <Text
                style={[styles.characterCount, { color: colors.placeholder }]}
              >
                {value.length}/{rest.maxLength}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
    marginVertical: 8,
  },
  label: {
    marginBottom: 8,
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: 16,
  },
  inputWrapper: {
    position: 'relative',
  },
  // The halo is absolutely positioned with negative offsets so that it appears outside the input.
  halo: {
    position: 'absolute',
    top: -4,
    left: 0,
    right: 0,
    bottom: -4,
    borderRadius: 14, // Ensure this is larger than inputContainer's borderRadius
    zIndex: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 8,
    paddingVertical: 8,
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.medium,
    paddingVertical: 4,
    marginLeft: 8,
    textAlignVertical: 'center',
  },
  leftAccessory: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontFamily: typography.fontFamilies.poppins.regular,
  },
  sendText: {
    fontSize: 14,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  errorText: {
    fontSize: 14,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  helperText: {
    fontSize: 12,
    fontFamily: typography.fontFamilies.poppins.regular,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  characterCount: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});

export default React.memo(Input);
