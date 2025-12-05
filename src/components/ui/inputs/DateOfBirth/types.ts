import { FormikHelpers, FormikValues } from 'formik';

export interface DateOfBirthProps {
  name: string;
  label: string;
  formik: FormikValues & FormikHelpers<any>;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  helperText?: string;
}
