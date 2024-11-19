import React, { useCallback, useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { StyleSheet, View } from 'react-native';
import { useRegistration } from '@/src/context/RegistrationContext';
import Input from '@/src/UI/Input';
import { useTheme } from '@/src/theme/ThemeContext';
import Footer from '@/src/components/atoms/footer';
import Header from '@/src/components/atoms/heading';

// Yup validation schema for the name field
const nameSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name is too short')
    .max(32, 'Name is too long'),
});

// Define FormValues type
interface FormValues {
  name: string;
}

export default function Name() {
  const { state, handleSubmitStep } = useRegistration();
  const { colors } = useTheme();

  // Formik usage
  const formik = useFormik<FormValues>({
    initialValues: { name: state.formData.name },
    validationSchema: nameSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleSubmitStep(nameSchema, ['name'], { name: values.name });
      } catch (error) {
        console.error('Error submitting name', error);
      } finally {
        setSubmitting(false);
      }
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  const iconColor = useMemo(() => {
    if (formik.errors.name && formik.touched.name) {
      return colors.error;
    }
    return colors.secondary;
  }, [formik.errors.name, formik.touched.name]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Header
          title="What's your name?"
          subtitle="Enter the name by which you wish to be known; this will be your display name."
        />
        <Input
          placeholder="Name"
          LeftAccessory={() => (
            <Ionicons
              name="person"
              size={26}
              color={iconColor}
              style={styles.icon}
            />
          )}
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
          error={formik.touched.name ? formik.errors.name : undefined}
        />
      </View>
      <Footer
        onPress={handleContinuePress}
        isDisabled={!formik.isValid || formik.isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
  },
});
