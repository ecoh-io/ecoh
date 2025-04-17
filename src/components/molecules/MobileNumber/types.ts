import { CountryCode } from 'libphonenumber-js/types';
import { TextInputProps, StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface ICountryCode {
  code: string;
  flag: string;
  country: CountryCode;
}

export interface MobileNumberInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  helperTextStyle?: StyleProp<TextStyle>;
  countryCode: ICountryCode;
  onCountryCodePress: () => void;
  showCountryPicker: boolean;
  setShowCountryPicker: (val: boolean) => void;
  handleCountrySelect: (country: ICountryCode) => void;
}
