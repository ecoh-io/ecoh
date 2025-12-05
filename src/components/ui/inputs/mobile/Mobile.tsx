import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  runOnJS,
  useAnimatedProps,
} from 'react-native-reanimated';
import { useTheme } from '@/src/theme/ThemeContext';
import { CountryPicker } from 'react-native-country-codes-picker';
import { AsYouType, CountryCode } from 'libphonenumber-js';
import { MobileNumberInputProps, ICountryCode } from './types';
import { styles } from './styles';
import { HelperText, ValidationIcon } from '../../feeback';
import { TextInput } from 'react-native-gesture-handler';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const MobileInput: React.FC<MobileNumberInputProps> = ({
  name,
  label = 'Mobile number',
  formik,
  initialCountry = 'GB',
  helperText,
  rightAccessory,
  onCountryChange,
}) => {
  const { colors } = useTheme();
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateField,
  } = formik;

  const inputRef = useRef<any>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [iconTint, setIconTint] = useState(colors.secondary);
  const [countryCode, setCountryCode] = useState<ICountryCode>({
    code: '+44',
    flag: '🇬🇧',
    country: initialCountry,
  });

  const value = values[name] ?? '';
  const error = errors[name];
  const isTouched = touched[name];
  const invalid = !!error && isTouched;
  const valid = !!value && !error;

  const isActuallyValid = !!value.trim() && !error && value.length >= 2;

  // Local UI states
  const [debouncedState, setDebouncedState] = useState({
    valid: false,
    invalid: false,
  });
  const [isFocused, setIsFocused] = useState(false);

  /** ─────────────────────────────
   *  Debounce Valid/Invalid states
   *  ───────────────────────────── */
  useEffect(() => {
    const handler = setTimeout(() => {
      const valid = isActuallyValid && value.trim().length > 0;
      const invalid = touched && !!error && value.trim().length > 0;
      setDebouncedState({ valid, invalid });
    }, 500);

    return () => clearTimeout(handler);
  }, [isActuallyValid, touched, error, value]);

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
   *  Handlers
   *  ───────────────────────────── */
  const handleFocus = () => {
    focused.value = true;
  };

  const handleBlur = () => {
    focused.value = false;
    setFieldTouched(name, true);
  };

  const handleChange = useCallback(
    (input: string) => {
      const formatted = new AsYouType(countryCode.country as CountryCode).input(
        input,
      );
      setFieldValue(name, formatted);
      onCountryChange?.(countryCode);

      // When typing again after validation, return to focus visuals
      if (debouncedState.valid || debouncedState.invalid) {
        setDebouncedState({ valid: false, invalid: false });
        progress.value = withTiming(1, {
          duration: 280,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
      }
    },
    [
      name,
      setFieldValue,
      onCountryChange,
      countryCode,
      debouncedState.valid,
      debouncedState.invalid,
    ],
  );

  const handleOpenPicker = () => {
    Keyboard.dismiss();
    setShowPicker(true);
    focused.value = true;
  };

  const handleSelect = (item: any) => {
    const selected: ICountryCode = {
      code: item.dial_code,
      flag: item.flag,
      country: item.code as CountryCode,
    };
    setCountryCode(selected);
    setShowPicker(false);
    validateField(name);
    onCountryChange?.(selected);
    focused.value = false;
  };

  const showHelper = !!helperText && !debouncedState.invalid;
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
          <TouchableOpacity
            style={styles.countryCodeContainer}
            onPress={handleOpenPicker}
          >
            <Animated.Text style={[styles.code, { color: iconTint }]}>
              {countryCode.code}
            </Animated.Text>
          </TouchableOpacity>

          <AnimatedTextInput
            ref={inputRef}
            value={value}
            onChangeText={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={!isFocused && !value ? label : undefined}
            animatedProps={animatedProps}
            style={[styles.input]}
            keyboardType="phone-pad"
            accessibilityLabel={label}
            accessible
          />

          <ValidationIcon
            valid={debouncedState.valid}
            invalid={debouncedState.invalid}
            colors={{ error: c.error, valid: c.valid }}
          />

          {rightAccessory && rightAccessory(iconTint)}
        </View>
      </Animated.View>

      <HelperText
        iconTint={iconTint}
        animatedStyle={animatedHelper}
        text={textToShow}
      />

      <CountryPicker
        lang="en"
        show={showPicker}
        onBackdropPress={() => setShowPicker(false)}
        pickerButtonOnPress={handleSelect}
        style={{
          modal: { height: 700 },
          line: { opacity: 0 },
          textInput: {
            padding: 16,
            height: 52,
            backgroundColor: colors.background,
            borderWidth: 2,
            borderRadius: 12,
            borderColor: colors.secondary,
          },
          countryButtonStyles: {
            height: 52,
            backgroundColor: colors.secondary,
            marginBottom: 8,
          },
        }}
      />
    </View>
  );
};
