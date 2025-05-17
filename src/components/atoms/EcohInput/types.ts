import { TextInputProps } from 'react-native';
import { FormikValues, FormikHelpers } from 'formik';

export interface EcohInputProps extends TextInputProps {
  name: string;
  label: string;
  formik: FormikValues & FormikHelpers<any>;
  icon?: (color: string) => React.ReactNode;
  secureTextEntry?: boolean;
  rightAccessory?: React.ReactNode;
  showError?: boolean;
  helperText?: string;
  dirty?: boolean;
}
