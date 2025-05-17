export interface UsernameAvailabilityIndicatorProps {
  isChecking: boolean | null;
  isAvailable: boolean | undefined;
  error?: string;
  value: string;
}
