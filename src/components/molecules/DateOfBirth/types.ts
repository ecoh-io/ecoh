export interface DateOfBirthProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  helperText?: string;
  setFieldError: (field: string, message: string | undefined) => void;
  setFieldTouched: (
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean,
  ) => void;
}
