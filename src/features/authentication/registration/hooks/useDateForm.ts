import { useFormik } from 'formik';
import { useRegistration } from '../context/RegistrationContext';
import { dobValidationSchema } from '../schemas/dobValidation';
import { useMemo } from 'react';

export const useDateForm = () => {
  const { state, handleSubmitStep } = useRegistration();

  const formik = useFormik({
    initialValues: {
      dateOfBirth: state.formData.dateOfBirth,
    },
    validationSchema: dobValidationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleSubmitStep(dobValidationSchema, ['dateOfBirth'], values);
      } catch (err) {
        console.error('❌ Date of birth step submission failed:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isFormIncomplete = useMemo(
    () => !formik.values.dateOfBirth,
    [formik.values],
  );

  return { formik, isFormIncomplete };
};
