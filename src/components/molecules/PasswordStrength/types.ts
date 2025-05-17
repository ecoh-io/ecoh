import { FormikHelpers, FormikValues } from 'formik';

export interface PasswordStrengthProps {
  name: string;
  formik: FormikValues & FormikHelpers<any>;
  isFocused?: boolean;
}

export type StrengthLevel =
  | 'Too Weak'
  | 'Weak'
  | 'Medium'
  | 'Strong'
  | 'Very Strong';
