import { RefObject } from 'react';
import { TextInput } from 'react-native';
import { FormikProps } from 'formik';
import { ICountryCode } from '../MobileNumber';

export interface IdentifierProps {
  isEmail: boolean;
  toggleInputMode: () => void;
  formik: FormikProps<{ identifier: string }>;
  iconColor: string;
  countryCode: ICountryCode;
  handleCountryCodePress: () => void;
  handleMobileChange: (text: string) => void;
  handleCountrySelect: (country: ICountryCode) => void;
  showCountryPicker: boolean;
  setShowCountryPicker: (show: boolean) => void;
  emailRef: RefObject<TextInput>;
  mobileRef: RefObject<TextInput>;
}
