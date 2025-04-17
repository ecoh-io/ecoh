import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { RadioButtonGroupProps } from './types';
import { RadioButton } from '../../atoms';

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  direction = 'vertical',
  containerStyle,
  error = false,
  header,
  headerStyle,
  selectedValue,
  onValueChange,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {header && (
        <Text
          style={[
            styles.header,
            headerStyle,
            { color: error ? 'red' : '#000' },
          ]}
        >
          {header}
        </Text>
      )}
      <View
        style={[
          direction === 'horizontal' ? styles.horizontal : styles.vertical,
        ]}
      >
        {options.map((option) => (
          <RadioButton
            key={option.value}
            label={option.label}
            selected={selectedValue === option.value}
            onPress={() => onValueChange(option.value)}
            size={24}
            iconName={undefined}
            error={error}
          />
        ))}
      </View>
      {error && <Text style={styles.errorText}>Please make a selection.</Text>}
    </View>
  );
};

export default RadioButtonGroup;
