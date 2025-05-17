import { RefObject } from 'react';
import { TextInput } from 'react-native';
import { FormikHelpers, FormikValues } from 'formik';
import { ICountryCode } from '../MobileNumber';

export interface IdentifierProps {
  isEmail: boolean;
  toggleInputMode: () => void;
  formik: FormikValues & FormikHelpers<any>;
  emailRef: RefObject<TextInput>;
  mobileRef: RefObject<TextInput>;
  onCountryChange?: (country: ICountryCode) => void;
}
