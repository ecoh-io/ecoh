import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  interpolateColor,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/src/theme/ThemeContext';
import { CountryPicker } from 'react-native-country-codes-picker';
import { AsYouType } from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js/types';
import { MobileNumberInputProps, ICountryCode } from './types';
import { styles } from './styles';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const MobileNumberInput: React.FC<MobileNumberInputProps> = ({
  name,
  label,
  formik,
  initialCountry = 'GB',
  onCountryChange,
  ...rest
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

  const inputRef = useRef<TextInput>(null);

  const [showPicker, setShowPicker] = useState(false);
  const [countryCode, setCountryCode] = useState<ICountryCode>({
    code: '+44',
    flag: '🇬🇧',
    country: initialCountry,
  });

  const value = values[name] ?? '';
  const error = errors[name];
  const isTouched = touched[name];
  const hasError = !!(error && isTouched);

  const [isFocused, setIsFocused] = useState(false);
  const focused = useSharedValue(false);
  const filled = useSharedValue(!!value);
  const hasErrorShared = useSharedValue(hasError);

  useEffect(() => {
    filled.value = !!value;
    hasErrorShared.value = hasError;
  }, [value, hasError]);

  const visualState = useDerivedValue(() =>
    withTiming(
      hasErrorShared.value ? 3 : focused.value ? 2 : filled.value ? 1 : 0,
      {
        duration: 160,
      },
    ),
  );

  const colorStates = {
    default: colors.default,
    filled: colors.filled,
    focused: colors.focused,
    error: colors.error,
  };

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      visualState.value,
      [0, 1, 2, 3],
      [
        colorStates.default,
        colorStates.filled,
        colorStates.focused,
        colorStates.error,
      ],
    ),
    borderWidth: 2,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      visualState.value,
      [0, 1, 2, 3],
      [
        colorStates.default,
        colorStates.filled,
        colorStates.focused,
        colorStates.error,
      ],
    ),
  }));

  const textColor = useAnimatedStyle(() => ({
    color: interpolateColor(
      visualState.value,
      [0, 1, 2, 3],
      [
        colorStates.default,
        colorStates.filled,
        colorStates.focused,
        colorStates.error,
      ],
    ),
  }));

  const dividerColor = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      visualState.value,
      [0, 1, 2, 3],
      [
        colorStates.default,
        colorStates.filled,
        colorStates.focused,
        colorStates.error,
      ],
    ),
  }));

  const handleFocus = () => {
    setIsFocused(true);
    focused.value = true;
  };

  const handleBlur = () => {
    setIsFocused(false);
    focused.value = false;
    setFieldTouched(name, true);
  };

  const handleChange = (input: string) => {
    const formatted = new AsYouType(countryCode.country as CountryCode).input(
      input,
    );
    setFieldValue(name, formatted);
  };

  const handleOpenPicker = () => {
    inputRef.current?.blur();
    setShowPicker(true);
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
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.inputWrapper, borderStyle]}>
        <Animated.Text style={[styles.label, labelStyle]}>
          {label}
        </Animated.Text>

        <View style={styles.innerRow}>
          <TouchableOpacity
            style={styles.countryCodeContainer}
            onPress={handleOpenPicker}
            accessibilityRole="button"
            accessibilityLabel="Choose country code"
          >
            <Text style={styles.flag}>{countryCode.flag}</Text>
            <Animated.Text style={[styles.code, textColor]}>
              {countryCode.code}
            </Animated.Text>
            <Animated.View style={[styles.divider, dividerColor]} />
          </TouchableOpacity>

          <AnimatedTextInput
            ref={inputRef}
            value={value}
            onChangeText={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={!isFocused && !value ? label : ''}
            placeholderTextColor={colors.secondary}
            style={[styles.input, textColor]}
            keyboardType="phone-pad"
            accessibilityLabel={label}
            accessible
            {...rest}
          />
        </View>
      </Animated.View>

      {isTouched && error && <Text style={styles.errorText}>{error}</Text>}

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

export default React.memo(MobileNumberInput);
