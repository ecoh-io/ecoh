// FormikEcohDropdown.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useField } from 'formik';
import EcohDropdown, { DropdownOption } from './Dropdown';
import { typography } from '@/src/theme/typography';

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
}

const FormikEcohDropdown: React.FC<FormikEcohDropdownProps> = ({
  name,
  options,
  placeholder,
  multiSelect,
  renderOption,
  style,
}) => {
  // useField provides field, meta, and helpers for Formik integration.
  const [field, meta, helpers] = useField(name);

  return (
    <View style={style}>
      <EcohDropdown
        options={options}
        selected={field.value}
        onSelect={(value: any) => helpers.setValue(value)}
        placeholder={placeholder}
        multiSelect={multiSelect}
        renderOption={renderOption}
      />
      {meta.touched && meta.error ? (
        <Text style={styles.errorText}>{meta.error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: 12,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});

export default FormikEcohDropdown;
