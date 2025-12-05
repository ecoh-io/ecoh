import React, { useEffect, useState, useCallback, forwardRef } from 'react';
import { Text, View, Pressable, TextInput } from 'react-native';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  useAnimatedProps,
  interpolateColor,
  useAnimatedReaction,
  runOnJS,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Ionicons, FontAwesome5, Octicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { EcohInputProps } from './types';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ANIM = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
};

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
    const { values, errors, touched, setFieldValue, setFieldTouched } = formik;

    const value = values[name] ?? '';
    const error = errors[name];
    const isTouched = touched[name];

    const isActuallyValid = !!value.trim() && !error && value.length >= 2;

    // Local UI states
    const [debouncedState, setDebouncedState] = useState({
      valid: false,
      invalid: false,
    });
    const [iconTint, setIconTint] = useState(colors.secondary);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    /** ─────────────────────────────
     *  Debounce Valid/Invalid states
     *  ───────────────────────────── */
    useEffect(() => {
      const handler = setTimeout(() => {
        const valid = isActuallyValid && value.trim().length > 0;
        const invalid = isTouched && !!error && value.trim().length > 0;
        setDebouncedState({ valid, invalid });
      }, 500);

      return () => clearTimeout(handler);
    }, [isActuallyValid, isTouched, error, value]);

    /** ─────────────────────────────
     *  Shared Values
     *  ───────────────────────────── */
    const focused = useSharedValue(false);
    const progress = useSharedValue(0); // 0 = default, 1 = focus, 2 = valid, 3 = error

    const hasErrorShared = useSharedValue(debouncedState.invalid);
    useEffect(() => {
      const newError = !!debouncedState.invalid;
      if (hasErrorShared.value !== newError) hasErrorShared.value = newError;
    }, [debouncedState.invalid]);

    const [persistedError, setPersistedError] = useState(error || '');
    const [persistedHelper, setPersistedHelper] = useState(helperText || '');

    useEffect(() => {
      if (error) setPersistedError(error);
    }, [error]);

    useEffect(() => {
      if (helperText) setPersistedHelper(helperText);
    }, [helperText]);

    useAnimatedReaction(
      () => focused.value,
      (val, prev) => {
        if (val !== prev) runOnJS(setIsFocused)(val);
      },
      [],
    );

    /** ─────────────────────────────
     *  Unified Visual State
     *  ───────────────────────────── */
    useEffect(() => {
      let target = 0; // default

      if (debouncedState.invalid)
        target = 3; // error
      else if (debouncedState.valid && !focused.value)
        target = 2; // valid on blur
      else if (debouncedState.valid && focused.value)
        target = 2; // keep valid visuals if valid while focused
      else if (focused.value)
        target = 1; // typing focus
      else target = 0;

      progress.value = withTiming(target, {
        duration: 280,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      });
    }, [debouncedState.invalid, debouncedState.valid, focused.value]);

    /** ─────────────────────────────
     *  Color Map
     *  ───────────────────────────── */
    const c = {
      default: colors.default,
      focused: colors.focused, // lively focus
      validField: colors.valid, // calmer validated
      valid: colors.success, // vivid tick
      validHelper: colors.validHelper, // subtle helper
      error: colors.error,
    };

    /** ─────────────────────────────
     *  Animated Styles
     *  ───────────────────────────── */
    const borderAnimatedStyle = useAnimatedStyle(() => ({
      borderColor: interpolateColor(
        progress.value,
        [0, 1, 2, 3],
        [c.default, c.focused, c.validField, c.error],
      ),
      borderWidth: 1.5,
    }));

    const labelAnimatedStyle = useAnimatedStyle(() => ({
      color: interpolateColor(
        progress.value,
        [0, 1, 2, 3],
        [c.default, c.focused, c.validField, c.error],
      ),
      opacity: withTiming(1, { duration: 200 }),
    }));

    const inputAnimatedStyle = useAnimatedStyle(() => ({
      color: interpolateColor(
        progress.value,
        [0, 1, 2, 3],
        [c.default, c.focused, c.focused, c.error],
      ),
    }));

    const helperTextStyle = useAnimatedStyle(() => ({
      color: interpolateColor(
        progress.value,
        [0, 1, 2, 3],
        [c.default, c.focused, c.validHelper, c.error],
      ),
      opacity: withTiming(0.95 + 0.05 * (progress.value / 3), {
        duration: 240,
      }),
    }));

    const animatedIconColor = useDerivedValue(() => {
      return interpolateColor(
        progress.value,
        [0, 1, 2, 3],
        [c.default, c.focused, c.validHelper, c.error],
      );
    });

    useAnimatedReaction(
      () => animatedIconColor.value,
      (current, prev) => {
        if (current !== prev) {
          runOnJS(setIconTint)(current);
        }
      },
      [],
    );

    /** ─────────────────────────────
     *  Icon Animations
     *  ───────────────────────────── */
    const showValid = debouncedState.valid;
    const showInvalid = debouncedState.invalid;

    const checkOpacity = useSharedValue(showValid ? 1 : 0);
    const crossOpacity = useSharedValue(showInvalid ? 1 : 0);
    const checkScale = useSharedValue(showValid ? 1 : 0.85);
    const crossScale = useSharedValue(showInvalid ? 1 : 0.85);

    useEffect(() => {
      if (showValid) {
        checkOpacity.value = withTiming(1, ANIM);
        checkScale.value = withTiming(1, ANIM);
        crossOpacity.value = withTiming(0, ANIM);
      } else if (showInvalid) {
        crossOpacity.value = withTiming(1, ANIM);
        crossScale.value = withTiming(1, ANIM);
        checkOpacity.value = withTiming(0, ANIM);
      } else {
        checkOpacity.value = withTiming(0, ANIM);
        crossOpacity.value = withTiming(0, ANIM);
      }
    }, [showValid, showInvalid]);

    useEffect(() => {
      if (showValid || showInvalid) {
        const scaleRef = showValid ? checkScale : crossScale;
        scaleRef.value = withSequence(
          withTiming(0.85, {
            duration: ANIM.duration * 0.3,
            easing: ANIM.easing,
          }),
          withTiming(1, {
            duration: ANIM.duration,
            easing: Easing.out(Easing.cubic),
          }),
        );
      }
    }, [showValid, showInvalid]);

    const checkAnimatedStyle = useAnimatedStyle(() => ({
      opacity: checkOpacity.value,
      transform: [{ scale: checkScale.value }],
    }));

    const crossAnimatedStyle = useAnimatedStyle(() => ({
      opacity: crossOpacity.value,
      transform: [{ scale: crossScale.value }],
    }));

    const ValidationIcon = () => (
      <Animated.View style={styles.validationIconContainer}>
        <Animated.View style={[styles.validationIcon, crossAnimatedStyle]}>
          <FontAwesome5 name="times" size={20} color={colors.error} />
        </Animated.View>
        <Animated.View style={[styles.validationIcon, checkAnimatedStyle]}>
          <FontAwesome5 name="check" size={20} color={c.valid} />
        </Animated.View>
      </Animated.View>
    );

    /** ─────────────────────────────
     *  Input Handlers
     *  ───────────────────────────── */
    const onFocus = () => (focused.value = true);
    const onBlur = () => {
      focused.value = false;
      setFieldTouched(name, true);
    };

    /** reset valid state when user types again */
    const handleChangeText = useCallback(
      (text: string) => {
        setFieldValue(name, text);
        onChangeText?.(text);

        // When typing again after validation, return to focus visuals
        if (debouncedState.valid || debouncedState.invalid) {
          setDebouncedState({ valid: false, invalid: false });
          progress.value = withTiming(1, ANIM);
        }
      },
      [
        name,
        setFieldValue,
        onChangeText,
        debouncedState.valid,
        debouncedState.invalid,
      ],
    );

    const showHelper = !!helperText && !debouncedState.invalid;
    const needsLeftSpacing = icon || secureTextEntry || rightAccessory;

    /** ─────────────────────────────
     *  Render
     *  ───────────────────────────── */
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
              animatedProps={useAnimatedProps(() => ({
                placeholderTextColor: interpolateColor(
                  progress.value,
                  [1, 2, 3, 4],
                  [c.default, c.focused, c.valid, c.error],
                ),
              }))}
              onChangeText={handleChangeText}
              onFocus={onFocus}
              onBlur={onBlur}
              style={[
                styles.input,
                needsLeftSpacing && { flex: 1 },
                inputAnimatedStyle,
              ]}
              placeholder={!isFocused && !value ? label : undefined}
              secureTextEntry={secureTextEntry && !showPassword}
            />

            {secureTextEntry ? (
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
            ) : (
              rightAccessory && (
                <View style={{ marginRight: 4 }}>
                  {rightAccessory(iconTint)}
                </View>
              )
            )}

            <ValidationIcon />
          </View>
        </Animated.View>

        {/* Helper text always mounted - no flicker */}
        <Animated.View style={[styles.helperTextRow]}>
          <Octicons name="info" size={16} color={iconTint} />
          <Animated.Text style={[styles.helperText, helperTextStyle]}>
            {debouncedState.invalid
              ? persistedError
              : showHelper
                ? persistedHelper
                : ''}
          </Animated.Text>
        </Animated.View>
      </View>
    );
  },
);
