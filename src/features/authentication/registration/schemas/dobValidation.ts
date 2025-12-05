import * as Yup from 'yup';

export const dobValidationSchema = Yup.object().shape({
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 16)),
      'You must be at least 16 years old to continue.',
    ),
});
