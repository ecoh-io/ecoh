import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { DateOfBirthInputProps } from './types';
import Input from '../Input';
import moment from 'moment';
import { useTheme } from '@/src/theme/ThemeContext';
import * as Localization from 'expo-localization';
import { Ionicons } from '@expo/vector-icons';

interface EnhancedDateOfBirthInputProps extends DateOfBirthInputProps {
  setFieldValue: (field: string, value: any) => void;
  fieldName: string;
}

const DateOfBirthInput: React.FC<EnhancedDateOfBirthInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperTextStyle,
  setFieldValue,
  fieldName,
  ...rest
}) => {
  const { colors } = useTheme();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  const locale = useMemo(() => {
    const locales = Localization.getLocales();
    return locales.length > 0 ? locales[0].languageTag : 'en-US'; // Fallback to 'en-US' if no locale found
  }, []);

  const handleConfirm = useCallback(
    (selectedDate: Date) => {
      setDate(selectedDate);
      setDatePickerVisibility(false);
      setFieldValue(fieldName, selectedDate);
    },
    [setFieldValue, fieldName],
  );

  const handleCancel = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const formattedDate = useMemo(() => {
    if (!date) return '';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }, [date]);

  const openDatePicker = () => {
    setDatePickerVisibility(true);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={openDatePicker}
        accessible
        accessibilityLabel="Select date of birth"
      >
        <Input
          label={label}
          error={error}
          helperText={helperText}
          value={formattedDate}
          placeholder="DD/MM/YYYY"
          editable={false} // Make the input non-editable
          LeftAccessory={() => (
            <Ionicons
              name="calendar-outline"
              size={24}
              color={error ? colors.error : colors.secondary}
            />
          )}
          pointerEvents="none" // Disable touch events on the TextInput
          inputStyle={[inputStyle, { color: colors.text }]}
          labelStyle={labelStyle}
          errorStyle={errorStyle}
          helperTextStyle={helperTextStyle}
          {...rest}
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        maximumDate={new Date()}
        minimumDate={new Date(1900, 0, 1)}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        locale={locale}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});

export default React.memo(DateOfBirthInput);
