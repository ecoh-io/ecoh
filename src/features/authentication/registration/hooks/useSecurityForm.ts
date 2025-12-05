import { useCallback, useState } from 'react';
import { useRegistration } from '../context/RegistrationContext';
import { useFormik } from 'formik';
import { securitySchema } from '../schemas/securitySchema';

export function useSecurityForm() {
  const { state, handleSubmitStep } = useRegistration();
  const [fieldDirty, setFieldDirty] = useState<{ [key: string]: boolean }>({});

  const formik = useFormik({
    initialValues: {
      password: state.formData.password,
      confirmPassword: '',
    },
    validationSchema: securitySchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleSubmitStep(securitySchema, ['password'], {
          password: values.password,
        });
      } catch (error) {
        console.error('Error submitting password:', error);
      } finally {
        setSubmitting(false);
      }
    },
    validateOnBlur: false,
    validateOnChange: true,
  });

  const markDirty = useCallback((name: string) => {
    setFieldDirty((prev) => ({ ...prev, [name]: true }));
  }, []);

  const isDisabled = !formik.values.password || !formik.values.confirmPassword;

  return {
    formik,
    markDirty,
    fieldDirty,
    isDisabled,
  };
}
