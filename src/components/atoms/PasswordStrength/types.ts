export type PasswordStrengthProps = {
  /** the raw password string */
  password: string;
  /** number of segments (defaults to 4) */
  segments?: 4 | 5 | 6;
  /** height of the bar (defaults to 8) */
  height?: number;
  /** gap between segments (defaults to 4) */
  gap?: number;
};
