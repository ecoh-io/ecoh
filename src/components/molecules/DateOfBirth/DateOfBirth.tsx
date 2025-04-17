import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Localization from 'expo-localization';
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
  const [isPickerVisible, setPickerVisible] = useState(false);

  const locale = useMemo(() => {
    const locales = Localization.getLocales();
    return locales.length > 0 ? locales[0].languageTag : 'en-GB';
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
      LayoutAnimation.easeInEaseOut();
      const age = calculateAge(selectedDate);
      setFieldTouched('dateOfBirth', true);

      if (age < 16) {
        setFieldError('dateOfBirth', 'You must be at least 16 years old');
      } else {
        setFieldError('dateOfBirth', undefined);
      }

      onChange(selectedDate);
      setPickerVisible(false);
    },
    [calculateAge, setFieldTouched, setFieldError, onChange],
  );

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.inputBox,
          {
            borderColor: error ? colors.error : colors.secondary,
            backgroundColor: colors.background,
          },
        ]}
        onPress={() => setPickerVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons
          name="calendar-outline"
          size={24}
          color={error ? colors.error : colors.secondary}
          style={styles.icon}
        />
        <Text
          style={[
            styles.inputText,
            { color: value ? colors.text : colors.secondary },
          ]}
        >
          {formattedDate || 'Date of Birth'}
        </Text>
      </TouchableOpacity>

      {error ? (
        <AnimatedWrapper
          visible
          animation="fade-in"
          exitAnimation="fade-out"
          duration={250}
        >
          <View style={[styles.errorChip, { backgroundColor: colors.error }]}>
            <Text style={[styles.errorText, { color: colors.onError }]}>
              {error}
            </Text>
          </View>
        </AnimatedWrapper>
      ) : helperText ? (
        <View style={styles.helperTextRow}>
          <Ionicons
            name="alert-circle-outline"
            size={16}
            color={colors.placeholder}
            style={styles.helperIcon}
          />
          <Text style={[styles.helperText, { color: colors.placeholder }]}>
            {helperText}
          </Text>
        </View>
      ) : null}

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
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
