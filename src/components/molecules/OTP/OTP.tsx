import React, { useRef, useEffect, useCallback } from 'react';
import { View, TextInput, Text, Keyboard } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { OTPProps } from './types';
import AnimatedWrapper from '@/src/animation/AnimatedWrapper';

const OTP: React.FC<OTPProps> = ({
  length = 6,
  value,
  onChange,
  autoFocus = false,
  isNumeric = true,
  isSecure = false,
  containerStyle,
  inputStyle,
  error,
}) => {
  const { colors } = useTheme();
  const inputsRef = useRef<TextInput[]>([]);

  useEffect(() => {
    if (autoFocus && inputsRef.current.length > 0) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Handle full OTP paste
      if (text.length === length) {
        onChange(text.slice(0, length));
        inputsRef.current[length - 1]?.blur();
        return;
      }

      const newValue = value.split('');
      newValue[index] = text;

      if (text && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      onChange(newValue.join(''));
    },
    [value, onChange, length],
  );

  const handleKeyPress = useCallback(
    (event: any, index: number) => {
      if (event.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    },
    [value],
  );

  const renderInputs = () => {
    return Array.from({ length }).map((_, i) => (
      <TextInput
        key={i}
        ref={(ref) => (inputsRef.current[i] = ref!)}
        value={value[i] || ''}
        onChangeText={(text) => handleChange(text, i)}
        onKeyPress={(event) => handleKeyPress(event, i)}
        style={[
          styles.input,
          inputStyle,
          {
            borderColor: error ? colors.error : colors.secondary,
            color: colors.text,
            backgroundColor: colors.background,
          },
        ]}
        keyboardType={isNumeric ? 'number-pad' : 'default'}
        secureTextEntry={isSecure}
        maxLength={1}
        returnKeyType="done"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        accessible
        accessibilityLabel={`OTP digit ${i + 1}`}
      />
    ));
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.inputRow}>{renderInputs()}</View>

      {error && (
        <AnimatedWrapper
          visible
          animation="fade-in"
          exitAnimation="fade-out"
          duration={300}
        >
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </AnimatedWrapper>
      )}
    </View>
  );
};

export default React.memo(OTP);
