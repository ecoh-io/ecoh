import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { OTPInputProps } from './types';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';

const OTPInput: React.FC<OTPInputProps> = ({
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
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (text: string, index: number) => {
    const newValue = value.split('');
    newValue[index] = text;

    if (text && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    onChange(newValue.join(''));
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const renderInputs = () => {
    const inputs = [];

    for (let i = 0; i < length; i++) {
      inputs.push(
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
            },
          ]}
          keyboardType={isNumeric ? 'number-pad' : 'default'}
          secureTextEntry={isSecure}
          maxLength={1}
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
        />,
      );
    }

    return inputs;
  };

  return (
    <View style={containerStyle}>
      <View style={styles.inputContainer}>{renderInputs()}</View>
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  input: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
  },
  errorText: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: typography.fontFamilies.poppins.bold,
  },
});

export default OTPInput;
