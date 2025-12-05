import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { CountryCode } from 'libphonenumber-js';
import * as Localization from 'expo-localization';
import { useRegistration } from '@/src/features/authentication/registration/context/RegistrationContext';
import { countryMap } from '@/src/shared/constants/countryMap';
import { getIdentifierValidationSchema } from '../schemas/mobileValidation';
import { ICountryCode } from '@/src/components/ui/inputs/mobile/types';

export function useMobileForm() {
  const { handleSubmitStep, state } = useRegistration();

  const getInitialCountry = (): ICountryCode => {
    const region = Localization.getLocales()[0].regionCode || 'GB';
    return countryMap[region] || countryMap['GB'];
  };

  const [mobileCountry, setMobileCountry] =
    useState<ICountryCode>(getInitialCountry);

  const validationSchema = getIdentifierValidationSchema(
    mobileCountry.country as CountryCode,
  );

  const formik = useFormik({
    initialValues: {
      mobile: state.formData.identifier,
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleSubmitStep(validationSchema, ['identifier'], {
          identifier: values.mobile,
        });
      } catch (error) {
        console.error('Error submitting identifier step:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isFormIncomplete = !formik.values.mobile;

  return {
    formik,
    mobileCountry,
    setMobileCountry,
    isFormIncomplete,
  };
}
