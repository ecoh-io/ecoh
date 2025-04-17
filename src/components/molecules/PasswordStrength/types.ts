export interface PasswordStrengthProps {
  password: string;
}

export type StrengthLevel =
  | 'Too Weak'
  | 'Weak'
  | 'Medium'
  | 'Strong'
  | 'Very Strong';
