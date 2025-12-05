import * as Yup from 'yup';

const EMAIL_MAX_LENGTH = 254;
const LOCAL_MAX_LENGTH = 64;

// Normalize: trim, collapse inner spaces, lowercase domain only.
function normalizeEmail(input: string | undefined | null): string {
  if (!input) return '';
  const trimmed = input.trim().replace(/\s+/g, ' ');
  const at = trimmed.indexOf('@');
  if (at === -1) return trimmed; // let schema fail later
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1).toLowerCase();
  return `${local}@${domain}`;
}

/**
 * Strict, pragmatic email regex (ASCII domain).
 * - Total <= 254, local <= 64 (enforced separately)
 * - Local: allowed RFC characters, dot-separated, no leading/trailing dot, no consecutive dots
 * - Domain: labels 1–63 chars, no leading/trailing hyphen, TLD 2–63 letters
 */
const EMAIL_REGEX =
  /^(?=.{1,254}$)(?=.{1,64}@)(?!.*\.\.)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])\.)+[A-Za-z]{2,63}$/;

export const emailSchema = Yup.object().shape({
  email: Yup.string()
    .transform((v) => normalizeEmail(v))
    .required('Email is required')
    .max(EMAIL_MAX_LENGTH, 'Email is too long')
    .test('local-part-length', 'Email local part is too long', (v) => {
      if (!v) return false;
      const i = v.indexOf('@');
      if (i === -1) return false;
      return i <= LOCAL_MAX_LENGTH;
    })
    .matches(EMAIL_REGEX, 'Enter a valid email address'),
});
