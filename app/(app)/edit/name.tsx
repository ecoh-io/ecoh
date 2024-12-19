import Header from '@/src/components/Profile/Edit/Header';
import { useEdit } from '@/src/context/EditContext';
import { useAuthStore } from '@/src/store/AuthStore';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import Input from '@/src/UI/Input';
import { Ionicons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as yup from 'yup';

const nameSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name is too short')
    .max(32, 'Name is too long'),
});

interface FormValues {
  name: string;
}

const Name: React.FC = () => {
  const { user, isLoading, updateName } = useEdit();
  const { colors } = useTheme();

  const formik = useFormik<FormValues>({
    initialValues: { name: user?.name || '' },
    validationSchema: nameSchema,
    onSubmit: (values: FormValues, { setSubmitting }) => {
      setSubmitting(false);
      updateName(values.name);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const iconColor = useMemo(() => {
    if (formik.errors.name && formik.touched.name) {
      return colors.error;
    }
    return colors.secondary;
  }, [formik.errors.name, formik.touched.name]);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title="Name"
        colors={colors}
        save={formik.handleSubmit}
        isSaving={isLoading}
        isDisabled={formik.isSubmitting || !formik.isValid}
      />
      <View style={styles.formContainer}>
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
        <Text style={styles.info}>
          {
            "Help people dicover your account by using the name that you're known by: either your full name, nickname or business name."
          }
        </Text>
        <Text style={styles.info}>
          {'You can only change your name once per 30 days.'}
        </Text>
      </View>
    </View>
  );
};

export default Name;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 20,
    paddingVertical: 15,
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
  },
  info: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: 13,
    paddingHorizontal: 4,
  },
});
