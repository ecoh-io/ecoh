import React, { useState, useCallback, useMemo } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { InputProps } from './types';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  placeholder,
  LeftAccessory,
  RightAccessory,
  secureTextEntry = false,
  secureTextEntryToggle = false,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperTextStyle,
  value,
  onChangeText,
  disabled,
  ...rest
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  // Handlers
  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <View style={[styles.container, containerStyle]}>
      {!!label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? colors.error
              : isFocused
              ? colors.highlight
              : colors.secondary,
          },
        ]}
      >
        {!!LeftAccessory && (
          <LeftAccessory style={styles.leftAccessory} editable={!disabled} />
        )}
        <TextInput
          style={[
            styles.input,
            inputStyle,
            {
              color: colors.text,
              paddingRight: secureTextEntryToggle || RightAccessory ? 40 : 12,
            },
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          value={value}
          placeholder={isFocused ? undefined : placeholder}
          placeholderTextColor={colors.secondary}
          accessibilityLabel={label}
          accessibilityHint={helperText || error}
          {...rest}
        />
        {!!RightAccessory && (
          <RightAccessory style={styles.rightAccessory} editable={!disabled} />
        )}
      </View>
      {error ? (
        <Text style={[styles.errorText, errorStyle, { color: colors.error }]}>
          {error}
        </Text>
      ) : (
        helperText && (
          <Text
            style={[
              styles.helperText,
              helperTextStyle,
              { color: colors.placeholder },
            ]}
          >
            {helperText}
          </Text>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.Poppins.medium,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  leftAccessory: {
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  rightAccessory: {
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: typography.Poppins.medium,
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: typography.Poppins.regular,
  },
  label: {
    marginBottom: 8,
    fontFamily: typography.Poppins.medium,
    fontSize: 16,
  },
});

export default React.memo(Input);
