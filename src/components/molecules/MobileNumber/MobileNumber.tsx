import React, { forwardRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { CountryPicker } from 'react-native-country-codes-picker';
import { MobileNumberInputProps } from './types';
import Input from '../../atoms/Input';
import { styles } from './styles';

const MobileNumberInput = forwardRef<TextInput, MobileNumberInputProps>(
  (
    {
      label,
      error,
      helperText,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      helperTextStyle,
      countryCode,
      onCountryCodePress,
      showCountryPicker,
      setShowCountryPicker,
      handleCountrySelect,
      ...rest
    },
    ref,
  ) => {
    const { colors } = useTheme();

    return (
      <View style={styles.wrapper}>
        <View style={containerStyle}>
          <Input
            ref={ref}
            label={label}
            error={error}
            helperText={helperText}
            placeholder="Mobile number"
            keyboardType="number-pad"
            inputStyle={[inputStyle, { color: colors.text }]}
            labelStyle={labelStyle}
            errorStyle={errorStyle}
            helperTextStyle={helperTextStyle}
            LeftAccessory={() => (
              <TouchableOpacity
                style={styles.countryCodeContainer}
                onPress={onCountryCodePress}
                accessibilityRole="button"
                accessibilityLabel="Choose country code"
              >
                <Text style={styles.countryFlag}>{countryCode.flag}</Text>
                <Text style={[styles.countryCodeText, { color: colors.text }]}>
                  {countryCode.code}
                </Text>
                <View
                  style={[
                    styles.dividerStyle,
                    { backgroundColor: colors.secondary },
                  ]}
                />
              </TouchableOpacity>
            )}
            {...rest}
          />
        </View>

        {/* Country Picker */}
        <CountryPicker
          lang="en"
          show={showCountryPicker}
          onBackdropPress={() => setShowCountryPicker(false)}
          pickerButtonOnPress={(item) =>
            handleCountrySelect({
              code: item.dial_code,
              flag: item.flag,
              country: item.code as any,
            })
          }
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
              fontFamily: typography.fontFamilies.poppins.regular,
            },
            countryButtonStyles: {
              height: 52,
              backgroundColor: colors.secondary,
              marginBottom: 8,
            },
            dialCode: {
              fontFamily: typography.fontFamilies.poppins.medium,
            },
            countryName: {
              fontFamily: typography.fontFamilies.poppins.medium,
            },
          }}
        />
      </View>
    );
  },
);

MobileNumberInput.displayName = 'MobileNumberInput';
export default React.memo(MobileNumberInput);
