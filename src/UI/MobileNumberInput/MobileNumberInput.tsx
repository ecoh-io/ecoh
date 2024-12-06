import React, { forwardRef, useMemo } from 'react';
import { MobileNumberInputProps } from './types';
import { CountryCode } from 'libphonenumber-js/types';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';
import Input from '../Input';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';

export interface ICountryCode {
  code: string;
  flag: string;
  country: CountryCode;
}

interface EnhancedMobileNumberInput
  extends Omit<MobileNumberInputProps, 'ref'> {
  countryCode: ICountryCode;
  onCountryCodePress: () => void;
}

const MobileNumberInputField = forwardRef<TextInput, EnhancedMobileNumberInput>(
  (
    {
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
      countryCode,
      onCountryCodePress,
      ...rest
    },
    ref,
  ) => {
    const { colors } = useTheme();

    const dividerStyle = useMemo(
      () => ({
        width: 3,
        backgroundColor: colors.secondary,
        borderRadius: 12,
        paddingVertical: 15,
      }),
      [],
    );

    return (
      <View style={styles.wrapper}>
        <View style={containerStyle}>
          <Input
            ref={ref}
            label={label}
            error={error}
            LeftAccessory={() => (
              <TouchableOpacity
                style={styles.countryCodeContainer}
                onPress={onCountryCodePress}
              >
                <Text style={styles.countryFlag}>{countryCode.flag}</Text>
                <Text style={[styles.countryCodeText, { color: colors.text }]}>
                  {countryCode.code}
                </Text>
                <View style={dividerStyle} />
              </TouchableOpacity>
            )}
            helperText={helperText}
            placeholder="Mobile number"
            keyboardType="number-pad"
            inputStyle={[inputStyle, { color: colors.text }]}
            labelStyle={labelStyle}
            errorStyle={errorStyle}
            helperTextStyle={helperTextStyle}
            {...rest}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.bold,
  },
  countryCodeText: {
    textAlign: 'center',
    fontSize: 16,
    marginRight: 8,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
});

export default React.memo(MobileNumberInputField);
