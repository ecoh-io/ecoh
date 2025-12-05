import * as Yup from 'yup';

export const identityValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(32, 'Too long'),
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username is too short'),
});
