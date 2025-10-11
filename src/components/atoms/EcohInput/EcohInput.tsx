import React, { useEffect, useState, useCallback, forwardRef } from 'react';
import { Text, View, Pressable, TextInputProps, TextInput } from 'react-native';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  useAnimatedProps,
  interpolateColor,
  useAnimatedReaction,
  runOnJS,
  withTiming,
  FadeIn,
  FadeOut,
  withDelay,
} from 'react-native-reanimated';
import { styles } from './styles';
import { EcohInputProps } from './types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';

// create an animated TextInput
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const EcohInput = forwardRef<TextInput, EcohInputProps>(
  (
    {
      name,
      label,
      formik,
      icon,
      secureTextEntry,
      rightAccessory,
      onChangeText,
      showError = true,
      helperText,
      dirty,
      ...rest
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const {
      values,
      errors,
      touched,
      setFieldValue,
      setFieldTouched,
      setFieldError,
    } = formik;

    const value = values[name] ?? '';
    const error = errors[name];
    const isTouched = touched[name];
    const showErrorMsg = isTouched && dirty && !!error && showError;

    const [iconTint, setIconTint] = useState(colors.secondary);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // shared values for state machine
    const focused = useSharedValue(false);
    const hasErrorShared = useSharedValue(showErrorMsg);

    useEffect(() => {
      const newError = !!showErrorMsg;

      if (hasErrorShared.value !== newError) hasErrorShared.value = newError;
    }, [value, showErrorMsg]);

    useAnimatedReaction(
      () => focused.value,
      (val, prev) => {
        if (val !== prev) {
          runOnJS(setIsFocused)(val);
        }
      },
      [],
    );

    // 0 = default, 1 = filled, 2 = focused, 3 = error
    const animatedVisualState = useDerivedValue(() =>
      withTiming(hasErrorShared.value ? 3 : focused.value ? 2 : 1, {
        duration: 160,
      }),
    );

    // your four color states
    const colorStates = {
      default: colors.default,
      focused: colors.focused,
      error: colors.error,
    };

    // border
    const borderAnimatedStyle = useAnimatedStyle(() => ({
      borderColor: interpolateColor(
        animatedVisualState.value,
        [1, 2, 3],
        [colorStates.default, colorStates.focused, colorStates.error],
      ),
      borderWidth: 2,
    }));

    // floating label
    const labelAnimatedStyle = useAnimatedStyle(() => ({
      color: interpolateColor(
        animatedVisualState.value,
        [1, 2, 3],
        [colorStates.default, colorStates.focused, colorStates.error],
      ),
    }));

    // input text color
    const inputAnimatedStyle = useAnimatedStyle(() => ({
      color: interpolateColor(
        animatedVisualState.value,
        [1, 2, 3],
        [colorStates.default, colorStates.focused, colorStates.error],
      ),
    }));

    // hook up icon tint
    const animatedIconColor = useDerivedValue(() =>
      interpolateColor(
        animatedVisualState.value,
        [1, 2, 3],
        [colorStates.default, colorStates.focused, colorStates.error],
      ),
    );
    useAnimatedReaction(
      () => animatedIconColor.value,
      (current, previous) => {
        if (current !== previous) runOnJS(setIconTint)(current);
      },
      [],
    );

    const helperColor = useDerivedValue(() =>
      interpolateColor(
        animatedVisualState.value,
        [1, 2], // ignore the error-state for helper
        [colorStates.default, colorStates.focused],
      ),
    );

    const helperTextStyle = useAnimatedStyle(() => ({
      color: helperColor.value,
    }));

    const shouldShowPlaceholder = !isFocused && !value;

    const animatedPlaceholderColor = useDerivedValue(() =>
      interpolateColor(
        animatedVisualState.value,
        [1, 2, 3],
        [colorStates.default, colorStates.focused, colorStates.error],
      ),
    );

    const animatedInputProps = useAnimatedProps(() => ({
      placeholderTextColor: animatedPlaceholderColor.value,
    }));

    const onFocus = () => {
      focused.value = true;
    };

    const onBlur = () => {
      focused.value = false;

      // Immediately sync current Formik error into shared value
      const error = formik.errors[name];
      hasErrorShared.value = !!error;

      setFieldTouched(name, true);
    };

    const handleChangeText = useCallback(
      (text: string) => {
        setFieldValue(name, text);
        if (onChangeText) {
          onChangeText(text);
        }
      },
      [name, setFieldValue, setFieldError, setFieldTouched, onChangeText],
    );

    const needsLeftSpacing = icon || secureTextEntry || rightAccessory;
    const showHelperMsg = !!helperText && !showErrorMsg;

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.inputWrapper, borderAnimatedStyle]}>
          <Animated.Text style={[styles.floatingLabel, labelAnimatedStyle]}>
            {label}
          </Animated.Text>

          <View style={styles.innerRow}>
            {icon && <View style={styles.iconContainer}>{icon(iconTint)}</View>}

            <AnimatedTextInput
              {...rest}
              ref={ref}
              value={value}
              animatedProps={animatedInputProps}
              onChangeText={handleChangeText}
              onFocus={onFocus}
              onBlur={onBlur}
              style={[
                styles.input,
                needsLeftSpacing ? { marginLeft: 8, flex: 1 } : null,
                inputAnimatedStyle,
              ]}
              placeholder={shouldShowPlaceholder ? label : undefined}
              secureTextEntry={secureTextEntry && !showPassword}
            />

            {secureTextEntry && (
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={12}
                style={{ padding: 4, marginLeft: 8 }}
              >
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color={iconTint}
                />
              </Pressable>
            )}

            {!secureTextEntry && rightAccessory && (
              <View style={{ marginRight: 4 }}>{rightAccessory(iconTint)}</View>
            )}
          </View>
        </Animated.View>

        {(showErrorMsg || showHelperMsg) && (
          <Animated.View
            key={showErrorMsg ? 'error' : 'helper'}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={showErrorMsg ? undefined : undefined}
          >
            {showErrorMsg ? (
              <View style={styles.helperTextRow}>
                <Animated.View>
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color={iconTint}
                  />
                </Animated.View>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <View style={styles.helperTextRow}>
                <Animated.View>
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color={iconTint}
                  />
                </Animated.View>
                <Animated.Text style={[styles.helperText, helperTextStyle]}>
                  {helperText}
                </Animated.Text>
              </View>
            )}
          </Animated.View>
        )}
      </View>
    );
  },
);
