import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Pressable, Platform, Keyboard } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
  useDerivedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Localization from 'expo-localization';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { ANIM } from '../input/constants';
import { DateOfBirthProps } from './types';
import { HelperText, ValidationIcon } from '../../feeback';

export const DateOfBirth: React.FC<DateOfBirthProps> = ({
  name = 'dateOfBirth',
  label = 'Date of Birth',
  formik,
  helperText,
}) => {
  const { colors } = useTheme();
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
  } = formik;

  const value = values[name] as Date | null;
  const error = errors[name] as string | undefined;
  const isTouched = touched[name];

  const [pickerVisible, setPickerVisible] = useState(false);
  const [iconTint, setIconTint] = useState(colors.secondary);

  /** ─────────────────────────────
   *  Derived validation
   *  ───────────────────────────── */
  const hasValue = !!value;
  const invalid = !!error && isTouched;
  const valid = hasValue && !error;

  /** ─────────────────────────────
   *  Shared animation values
   *  ───────────────────────────── */
  const focused = useSharedValue(false);
  const progress = useSharedValue(0); // 0=default,1=focus,2=valid,3=error

  useAnimatedReaction(
    () => ({
      isFocused: focused.value,
      isInvalid: invalid,
      isValid: valid,
    }),
    (state) => {
      let target = 0;

      if (state.isFocused) target = 1;
      else if (state.isInvalid) target = 3;
      else if (state.isValid) target = 2;

      progress.value = withTiming(target, {
        duration: 280,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      });
    },
    [invalid, valid],
  );

  /** ─────────────────────────────
   *  Color map
   *  ───────────────────────────── */
  const c = {
    default: colors.default,
    focused: colors.focused,
    validField: colors.valid,
    valid: colors.success,
    validHelper: colors.validHelper,
    error: colors.error,
  };

  /** ─────────────────────────────
   *  Animated styles
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
  }));

  const animatedHelper = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1, 2, 3],
      [c.default, c.focused, c.validHelper, c.error],
    ),
  }));

  const animatedIconColor = useDerivedValue(() =>
    interpolateColor(
      progress.value,
      [0, 1, 2, 3],
      [c.default, c.focused, c.validHelper, c.error],
    ),
  );

  useAnimatedReaction(
    () => animatedIconColor.value,
    (cur, prev) => {
      if (cur !== prev) runOnJS(setIconTint)(cur);
    },
    [],
  );

  /** ─────────────────────────────
   *  Locale formatting + age validation
   *  ───────────────────────────── */
  const locale = useMemo(() => {
    const [loc] = Localization.getLocales();
    return loc?.languageTag ?? 'en-GB';
  }, []);

  const formattedDate = useMemo(() => {
    if (!value) return '';
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(value);
  }, [value, locale]);

  const calculateAge = useCallback((dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }, []);

  const handleConfirm = useCallback(
    (selectedDate: Date) => {
      const age = calculateAge(selectedDate);
      setFieldTouched(name, true);

      if (age < 16) setFieldError(name, 'You must be at least 16 years old');
      else setFieldError(name, undefined);

      setFieldValue(name, selectedDate);
      setPickerVisible(false);
      focused.value = false;
    },
    [calculateAge, setFieldError, setFieldTouched, setFieldValue, name],
  );

  /** ─────────────────────────────
   *  Interactions
   *  ───────────────────────────── */
  const onOpen = () => {
    Keyboard.dismiss();
    setPickerVisible(true);
    focused.value = true;
  };

  const onCancel = () => {
    setPickerVisible(false);
    focused.value = false;
    Keyboard.dismiss();
  };

  const showHelper = !!helperText && !invalid;
  const textToShow = invalid ? error : showHelper ? helperText : '';

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputWrapper, animatedBorder]}>
        <Animated.Text style={[styles.floatingLabel, animatedLabel]}>
          {label}
        </Animated.Text>

        <Pressable style={styles.innerRow} onPress={onOpen}>
          <Animated.Text
            style={[
              styles.inputText,
              { color: formattedDate ? colors.text : c.default },
            ]}
          >
            {formattedDate || 'Select date'}
          </Animated.Text>

          <ValidationIcon
            valid={valid && !focused.value}
            invalid={invalid && !focused.value}
            colors={{ error: c.error, valid: c.valid }}
          />
        </Pressable>
      </Animated.View>

      <HelperText
        iconTint={iconTint}
        animatedStyle={animatedHelper}
        text={textToShow}
      />

      <DateTimePickerModal
        isVisible={pickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={onCancel}
        maximumDate={new Date()}
        minimumDate={new Date(1900, 0, 1)}
        locale={locale}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        pickerComponentStyleIOS={{ alignSelf: 'center' }}
      />
    </View>
  );
};
