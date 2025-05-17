import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Localization from 'expo-localization';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { DateOfBirthProps } from './types';
import AnimatedWrapper from '@/src/animation/AnimatedWrapper';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DateInput: React.FC<DateOfBirthProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  setFieldError,
  setFieldTouched,
}) => {
  const { colors } = useTheme();

  // shared values
  const focused = useSharedValue(false);
  const filled = useSharedValue(!!value);
  const hasErrorShared = useSharedValue(!!error);

  useEffect(() => {
    filled.value = !!value;
  }, [value]);

  useEffect(() => {
    hasErrorShared.value = !!error;
  }, [error]);

  // 0 = default, 1 = filled, 2 = focused, 3 = error
  const animatedVisualState = useDerivedValue(() =>
    withTiming(
      hasErrorShared.value ? 3 : focused.value ? 2 : filled.value ? 1 : 0,
      { duration: 160 },
    ),
  );

  const colorStates = {
    default: colors.default,
    filled: colors.filled,
    focused: colors.focused,
    error: colors.error,
  };

  // animated border
  const borderStyle = useAnimatedStyle(() => ({
    borderWidth: 2,
    borderColor: interpolateColor(
      animatedVisualState.value,
      [0, 1, 2, 3],
      [
        colorStates.default,
        colorStates.filled,
        colorStates.focused,
        colorStates.error,
      ],
    ),
  }));

  // animated label
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      animatedVisualState.value,
      [0, 1, 2, 3],
      [
        colorStates.default,
        colorStates.filled,
        colorStates.focused,
        colorStates.error,
      ],
    ),
  }));

  // animated input text
  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      animatedVisualState.value,
      [0, 1, 2, 3],
      [
        colorStates.default,
        colorStates.filled,
        colorStates.focused,
        colorStates.error,
      ],
    ),
  }));

  // animated icon tint
  const [iconColor, setIconColor] = useState(colors.secondary);
  const animatedIconColor = useDerivedValue(() =>
    interpolateColor(
      animatedVisualState.value,
      [0, 1, 2, 3],
      [
        colorStates.default,
        colorStates.filled,
        colorStates.focused,
        colorStates.error,
      ],
    ),
  );
  useAnimatedReaction(
    () => animatedIconColor.value,
    (cur, prev) => {
      if (cur !== prev) runOnJS(setIconColor)(cur);
    },
    [],
  );

  // NEW: helper text color (cycle only through states 0,1,2)
  const helperColor = useDerivedValue(() =>
    interpolateColor(
      animatedVisualState.value,
      [0, 1, 2],
      [colorStates.default, colorStates.filled, colorStates.focused],
    ),
  );
  const helperTextStyle = useAnimatedStyle(() => ({
    color: helperColor.value,
  }));
  const helperIconStyle = useAnimatedStyle(() => ({
    color: helperColor.value,
  }));

  // locale + formatting
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

  // age check logic
  const calculateAge = useCallback((dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }, []);

  const handleConfirm = useCallback(
    (selectedDate: Date) => {
      LayoutAnimation.easeInEaseOut();
      setFieldTouched('dateOfBirth', true);
      const age = calculateAge(selectedDate);
      if (age < 16) {
        setFieldError('dateOfBirth', 'You must be at least 16 years old');
      } else {
        setFieldError('dateOfBirth', undefined);
      }
      onChange(selectedDate);
      setPickerVisible(false);
      focused.value = false;
    },
    [calculateAge, onChange, setFieldError, setFieldTouched],
  );

  const [isPickerVisible, setPickerVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Animated.Text style={[styles.label, labelStyle]}>
          {label}
        </Animated.Text>
      )}

      <Animated.View style={[styles.inputBox, borderStyle]}>
        <TouchableOpacity
          style={styles.innerRow}
          activeOpacity={0.85}
          onPress={() => {
            Keyboard.dismiss();
            setPickerVisible(true);
            focused.value = true;
          }}
          onBlur={() => {
            focused.value = false;
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={24}
            color={iconColor}
            style={styles.icon}
          />
          <Animated.Text style={[styles.inputText, textStyle]}>
            {formattedDate || 'Date of Birth'}
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>

      {error ? (
        <AnimatedWrapper
          visible
          animation="fade-in"
          exitAnimation="fade-out"
          duration={250}
        >
          <Text style={styles.errorText}>{error}</Text>
        </AnimatedWrapper>
      ) : helperText ? (
        <View style={styles.helperTextRow}>
          <Animated.View>
            <Ionicons name="alert-circle-outline" size={16} color={iconColor} />
          </Animated.View>
          <Animated.Text style={[styles.helperText, helperTextStyle]}>
            {helperText}
          </Animated.Text>
        </View>
      ) : null}

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => {
          setPickerVisible(false);
          focused.value = false;
        }}
        maximumDate={new Date()}
        minimumDate={new Date(1900, 0, 1)}
        locale={locale}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        pickerComponentStyleIOS={{ alignSelf: 'center' }}
      />
    </View>
  );
};

export default React.memo(DateInput);
