import { StrengthLevel } from './types';

export function usePasswordStrength(password: string): {
  level: StrengthLevel;
  score: number;
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*#?&]/.test(password)) score++;

  let level: StrengthLevel = 'Too Weak';
  if (score === 1) level = 'Weak';
  else if (score === 2) level = 'Medium';
  else if (score === 3 || score === 4) level = 'Strong';
  else if (score === 5 && password.length >= 12) level = 'Very Strong';

  return { level, score: Math.min(score, 5) };
}
