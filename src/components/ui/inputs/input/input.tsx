import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { View, Pressable, TextInput, ActivityIndicator } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
  useAnimatedProps,
  useDerivedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { HelperText, ValidationIcon } from '../../feeback';
import { InputProps } from './types';
import { ANIM } from './constants';
import { styles } from './styles';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      name,
      label,
      formik,
      icon,
      onChangeText,
      rightAccessory,
      helperText,
      secureTextEntry,
      isChecking,
      networkValid,
      ...rest
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const { setFieldValue, setFieldTouched } = formik;

    const value = formik.values[name] ?? '';
    const error = formik.errors[name] as string | undefined;
    const touched = formik.touched[name];

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
      // 🟣 Immediate reactions to network state
      if (isChecking) {
        setDebouncedState({ valid: false, invalid: false });
        return; // don’t run delayed logic while checking
      }

      // 🟣 Immediate reaction to network result
      if (networkValid === false) {
        setDebouncedState({ valid: false, invalid: true });
        return;
      }
      if (networkValid === true) {
        setDebouncedState({ valid: true, invalid: false });
        return;
      }

      // 🟣 Debounced local validation (only when network idle)
      const handler = setTimeout(() => {
        const trimmed = value.trim();
        const localValid = isActuallyValid && trimmed.length > 0;
        const localInvalid = touched && !!error && trimmed.length > 0;

        if (localInvalid) {
          setDebouncedState({ valid: false, invalid: true });
        } else if (localValid) {
          setDebouncedState({ valid: true, invalid: false });
        } else {
          setDebouncedState({ valid: false, invalid: false });
        }
      }, 500);

      return () => clearTimeout(handler);
    }, [isActuallyValid, touched, error, value, isChecking, networkValid]);

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
      let target = 0;

      if (debouncedState.invalid)
        target = 3; // error
      else if (debouncedState.valid)
        target = 2; // valid
      else if (focused.value)
        target = 1; // focus
      else target = 0;

      const prev = progress.value;
      const comingFromError = prev === 3 && target === 1;
      const comingFromValid = prev === 2 && target === 3;
      const comingFromFocus = prev === 1 && target === 3;

      const instant = comingFromError || comingFromValid || comingFromFocus;

      progress.value = withTiming(target, {
        duration: instant ? 0 : 280,
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
    const animatedBorder = useAnimatedStyle(() => ({
      borderColor: interpolateColor(
        progress.value,
        [0, 1, 2, 3],
        [c.default, c.focused, c.validField, c.error],
      ),
      borderWidth: 1.5,
    }));

    const animatedLabel = useAnimatedStyle(() => ({
      color: interpolateColor(
        progress.value,
        [0, 1, 2, 3],
        [c.default, c.focused, c.validField, c.error],
      ),
      opacity: withTiming(1, { duration: 200 }),
    }));

    const animatedProps = useAnimatedProps(() => ({
      placeholderTextColor: interpolateColor(
        progress.value,
        [0, 1, 2, 3],
        [c.default, c.focused, c.focused, c.error],
      ),
    }));

    const animatedHelper = useAnimatedStyle(() => ({
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
     *  Input Handlers
     *  ───────────────────────────── */
    const onFocus = () => {
      focused.value = true;
      Haptics.selectionAsync();
    };
    const onBlur = () => {
      focused.value = false;
      setFieldTouched(name, true);
    };

    /** reset valid state when user types again */
    const onTextChanged = useCallback(
      (text: string) => {
        setFieldValue(name, text);
        onChangeText?.(text);

        // Only reset if coming from valid state, not from error
        if (debouncedState.valid) {
          setDebouncedState({ valid: false, invalid: false });
          progress.value = withTiming(1, ANIM);
        }

        // If previously invalid, don’t animate immediately — let debounce handle it
        if (debouncedState.invalid) {
          setDebouncedState((prev) => ({ ...prev, invalid: false }));
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

    // === dynamic copy ===
    const textToShow = debouncedState.invalid
      ? persistedError
      : showHelper
        ? persistedHelper
        : '';

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.inputWrapper, animatedBorder]}>
          <Animated.Text style={[styles.floatingLabel, animatedLabel]}>
            {label}
          </Animated.Text>

          <View style={styles.innerRow}>
            <AnimatedTextInput
              ref={ref}
              {...rest}
              value={value}
              onFocus={onFocus}
              onBlur={onBlur}
              onChangeText={onTextChanged}
              style={[styles.input]}
              animatedProps={animatedProps}
              secureTextEntry={secureTextEntry && !showPassword}
              placeholder={!isFocused && !value ? label : undefined}
            />

            {secureTextEntry && (
              <Pressable
                hitSlop={10}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={22}
                  color={iconTint}
                />
              </Pressable>
            )}

            {isChecking ? (
              <ActivityIndicator size="small" color={iconTint} />
            ) : (
              <ValidationIcon
                valid={debouncedState.valid}
                invalid={debouncedState.invalid}
                colors={{ error: c.error, valid: c.valid }}
              />
            )}
          </View>
        </Animated.View>

        <HelperText
          iconTint={iconTint}
          animatedStyle={animatedHelper}
          text={textToShow}
        />
      </View>
    );
  },
);
