import * as Yup from 'yup';
import { CountryCode, parsePhoneNumberWithError } from 'libphonenumber-js';

export const getIdentifierValidationSchema = (country: CountryCode) =>
  Yup.object().shape({
    mobile: Yup.string()
      .required('Mobile number is required')
      .test(
        'is-valid-mobile',
        'Please enter a valid mobile number',
        (value) => {
          if (!value) return false;
          try {
            const parsed = parsePhoneNumberWithError(value, country);
            return parsed.isValid() && parsed.getType() === 'MOBILE';
          } catch {
            return false;
          }
        },
      ),
  });
