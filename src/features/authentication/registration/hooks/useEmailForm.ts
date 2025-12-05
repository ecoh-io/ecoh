import { useFormik } from 'formik';
import { useRegistration } from '@/src/features/authentication/registration/context/RegistrationContext';
import { emailSchema } from '../schemas/emailValidation';
export function useEmailForm() {
  const { handleSubmitStep, state } = useRegistration();

  const formik = useFormik({
    initialValues: {
      email: state.formData.identifier,
    },
    validationSchema: emailSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleSubmitStep(emailSchema, ['identifier'], {
          identifier: values.email,
        });
      } catch (error) {
        console.error('Error submitting identifier step:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isFormIncomplete = !formik.values.email;

  return {
    formik,
    isFormIncomplete,
  };
}
