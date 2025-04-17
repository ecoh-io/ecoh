import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useField } from 'formik';
import Dropdown from './Dropdown';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { DropdownOption } from './types';
import AnimatedWrapper from '@/src/animation/AnimatedWrapper';

interface FormikEcohDropdownProps {
  name: string;
  options: DropdownOption[];
  placeholder?: string;
  multiSelect?: boolean;
  renderOption?: (
    option: DropdownOption,
    isSelected: boolean,
  ) => React.ReactNode;
  style?: any;
  leftIcon?: React.ReactNode;
  helperText?: string;
}

const FormikEcohDropdown: React.FC<FormikEcohDropdownProps> = ({
  name,
  options,
  placeholder,
  multiSelect,
  renderOption,
  style,
  leftIcon,
  helperText,
}) => {
  const [field, meta, helpers] = useField(name);
  const { colors } = useTheme();

  const hasError = meta.touched && meta.error;

  return (
    <View style={[styles.container, style]}>
      <Dropdown
        options={options}
        selected={field.value}
        onSelect={(value: any) => helpers.setValue(value)}
        placeholder={placeholder}
        multiSelect={multiSelect}
        renderOption={renderOption}
        leftIcon={leftIcon}
      />

      {/* Error Chip or Helper Text */}
      {hasError ? (
        <AnimatedWrapper
          visible={!!meta.error}
          animation="fade-in"
          exitAnimation="fade-out"
          duration={300}
        >
          <View style={[styles.errorChip, { backgroundColor: colors.error }]}>
            <Text style={[styles.errorText, { color: colors.onError }]}>
              {meta.error}
            </Text>
          </View>
        </AnimatedWrapper>
      ) : (
        helperText && (
          <Text style={[styles.helperText, { color: colors.placeholder }]}>
            {helperText}
          </Text>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
    marginVertical: 8,
  },
  errorChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});

export default FormikEcohDropdown;
