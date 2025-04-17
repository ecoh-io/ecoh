import React, {
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useEffect,
} from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { InputProps } from './types';
import AnimatedWrapper from '@/src/animation/AnimatedWrapper';

const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  const {
    label,
    placeholder,
    value = '',
    onChangeText,
    secureTextEntry = false,
    secureTextEntryToggle = false,
    RightAccessory,
    LeftAccessory,
    error,
    helperText,
    showCharacterCount = false,
    maxLength,
    onFocus,
    onBlur,
    onSend,
    inputStyle,
    labelStyle,
    helperTextStyle,
    errorStyle,
    containerStyle,
    disabled,
    ...rest
  } = props;

  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const haloAnim = useSharedValue(0);
  useEffect(() => {
    haloAnim.value = withTiming(error || isFocused ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  }, [error, isFocused]);

  const haloStyle = useAnimatedStyle(() => ({
    borderWidth: 1.5 + haloAnim.value * 1,
  }));

  const handleFocus = useCallback(
    (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  const toggleSecure = () => setIsSecure((prev) => !prev);
  const clearVisible = isFocused && value.length > 0 && !disabled;

  const rightIcons = useMemo(() => {
    const icons = [];

    if (clearVisible) {
      icons.push(
        <AnimatedWrapper key="clear" visible animation="fade-in">
          <TouchableOpacity
            onPress={() => onChangeText?.('')}
            style={styles.iconButton}
            accessibilityLabel="Clear input"
          >
            <Entypo name="cross" size={20} color={colors.highlight} />
          </TouchableOpacity>
        </AnimatedWrapper>,
      );
    }

    if (secureTextEntryToggle) {
      icons.push(
        <TouchableOpacity
          key="secure"
          onPress={toggleSecure}
          style={styles.iconButton}
          accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
        >
          <Text style={[styles.toggleText, { color: colors.highlight }]}>
            {isSecure ? 'Show' : 'Hide'}
          </Text>
        </TouchableOpacity>,
      );
    } else if (onSend) {
      icons.push(
        <TouchableOpacity
          key="send"
          onPress={() => onSend(value)}
          style={styles.iconButton}
        >
          <Text style={[styles.sendText, { color: colors.highlight }]}>
            Send
          </Text>
        </TouchableOpacity>,
      );
    } else if (RightAccessory) {
      icons.push(
        <RightAccessory
          key="right"
          style={styles.iconButton}
          editable={!disabled}
        />,
      );
    }

    return icons;
  }, [
    clearVisible,
    isSecure,
    secureTextEntryToggle,
    onSend,
    RightAccessory,
    value,
    disabled,
  ]);

  const borderColor = useMemo(() => {
    if (error) return colors.error;
    return isFocused ? colors.highlight : colors.secondary;
  }, [error, isFocused, colors]);

  const paddingRight = 8 + rightIcons.length * 28;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }, labelStyle]}>
          {label}
        </Text>
      )}

      <View style={styles.inputWrapper}>
        <Animated.View
          pointerEvents="none"
          style={[styles.halo, { borderColor }, haloStyle]}
        />
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.background },
          ]}
        >
          {LeftAccessory && (
            <LeftAccessory style={styles.leftAccessory} editable={!disabled} />
          )}

          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!disabled}
            style={[
              styles.input,
              inputStyle,
              {
                color: colors.text,
                paddingRight,
              },
            ]}
            secureTextEntry={secureTextEntryToggle ? isSecure : secureTextEntry}
            placeholder={isFocused ? undefined : placeholder}
            placeholderTextColor={error ? colors.error : colors.secondary}
            maxLength={maxLength}
            {...rest}
          />

          {rightIcons.map((icon) => icon)}
        </View>
      </View>

      {(error || helperText || (showCharacterCount && maxLength)) && (
        <View style={styles.bottomRow}>
          <View style={{ flex: 1 }}>
            {error ? (
              <AnimatedWrapper visible animation="fade-in">
                <View
                  style={[styles.errorChip, { backgroundColor: colors.error }]}
                >
                  <Text
                    style={[
                      styles.errorText,
                      { color: colors.onError },
                      errorStyle,
                    ]}
                  >
                    {error}
                  </Text>
                </View>
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

          {showCharacterCount && maxLength && (
            <Text
              style={[styles.characterCount, { color: colors.placeholder }]}
            >
              {value.length}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
});

Input.displayName = 'Input';
export default React.memo(Input);
