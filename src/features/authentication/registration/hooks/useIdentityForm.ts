import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { useDebounce } from 'use-debounce';
import { identityValidationSchema } from '../schemas/identityValidation';
import { useRegistration } from '../context/RegistrationContext';

interface FieldDirtyMap {
  [key: string]: boolean;
}

const useUsernameAvailability = (username: string, shouldFetch: boolean) => {
  const [data, setData] = useState<boolean | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!shouldFetch) {
      // not checking → ensure neutral state
      setIsFetching(false);
      setData(null);
      return;
    }

    setIsFetching(true);
    setData(null);

    const timer = setTimeout(() => {
      const taken = ['eco', 'admin', 'anthony'];
      const isAvailable = !taken.some((term) =>
        username.toLowerCase().includes(term),
      );

      setData(isAvailable);
      setIsFetching(false);
    }, 1000);

    return () => {
      // 🔑 if this request is cancelled by a new keystroke, drop spinner
      clearTimeout(timer);
      setIsFetching(false);
      setData(null);
    };
  }, [username, shouldFetch]);

  return { data, isFetching };
};

export const useIdentityForm = () => {
  const { state, handleSubmitStep } = useRegistration();
  const [fieldDirty, setFieldDirty] = useState<FieldDirtyMap>({});

  /** ---------------------------
   *  Formik Setup
   * -------------------------- */
  const formik = useFormik({
    initialValues: {
      name: state.formData.name,
      username: state.formData.username,
    },
    validationSchema: identityValidationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleSubmitStep(
          identityValidationSchema,
          ['name', 'username'],
          values,
        );
      } catch (err) {
        console.error('❌ Identity step submission failed:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  /** ---------------------------
   *  Username Availability Logic
   * -------------------------- */
  const [debouncedUsername] = useDebounce(formik.values.username.trim(), 500);

  const shouldCheckUsername = useMemo(
    () => debouncedUsername.length >= 3,
    [debouncedUsername],
  );

  const { data: isAvailable, isFetching } = useUsernameAvailability(
    debouncedUsername,
    shouldCheckUsername,
  );

  /** ---------------------------
   *  Field Dirty State
   * -------------------------- */
  const markDirty = useCallback((field: string) => {
    setFieldDirty((prev) => ({ ...prev, [field]: true }));
  }, []);

  /** ---------------------------
   *  Username Field Handling
   * -------------------------- */
  const handleUsernameChange = useCallback(
    (text: string) => {
      formik.setFieldValue('username', text);
      formik.setFieldTouched('username', true, false);
      markDirty('username');
    },
    [formik, markDirty],
  );

  /** ---------------------------
   *  Availability Sync Effect
   * -------------------------- */
  useEffect(() => {
    if (!shouldCheckUsername) return;

    // Reset if user starts typing again
    if (isFetching) {
      formik.setFieldError('username', undefined);
      return;
    }

    // Apply new result
    if (isAvailable === false) {
      formik.setFieldError('username', 'Username is already taken');
    } else if (isAvailable === true) {
      formik.setFieldError('username', undefined);
    }
  }, [shouldCheckUsername, isAvailable, isFetching]);
  /** ---------------------------
   *  Derived State
   * -------------------------- */
  const isFormIncomplete = useMemo(
    () => !formik.values.name || !formik.values.username,
    [formik.values],
  );

  return {
    formik,
    isAvailable,
    isFetching,
    fieldDirty,
    markDirty,
    handleUsernameChange,
    isFormIncomplete,
  };
};
