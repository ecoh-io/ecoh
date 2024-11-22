import { FormikProps } from 'formik';
import { TextInput } from 'react-native';
import { ICountryCode } from '../MobileNumberInput/MobileNumberInput';

export interface IdentifierInputProps {
  isEmail: boolean;
  emailRef: React.RefObject<TextInput>;
  mobileRef: React.RefObject<TextInput>;
  iconColor: string;
  formik: FormikProps<{ identifier: string }>;
  countryCode: ICountryCode;
  handleCountryCodePress: () => void;
  handleMobileChange: (text: string) => void;
  toggleInputMode: () => void;
}
