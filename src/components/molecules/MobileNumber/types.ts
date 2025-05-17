import { FormikHelpers, FormikValues } from 'formik';
import { CountryCode } from 'libphonenumber-js/types';
import { TextInputProps } from 'react-native';

export interface ICountryCode {
  code: string;
  flag: string;
  country: CountryCode;
}

export interface MobileNumberInputProps extends TextInputProps {
  name: string;
  label: string;
  formik: FormikValues & FormikHelpers<any>;
  initialCountry?: CountryCode;
  onCountryChange?: (country: ICountryCode) => void;
}
