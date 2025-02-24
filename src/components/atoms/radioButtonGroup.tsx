import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import RadioButton from './radioButton';

interface Option {
  label: string;
  value: string;
}

interface RadioButtonGroupProps {
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
  containerStyle?: StyleProp<ViewStyle>;
  error?: boolean;
  header?: string;
  headerStyle?: StyleProp<TextStyle>;
}

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
            iconName={undefined} // Remove icon for single select or customize as needed
            error={error}
          />
        ))}
      </View>
      {error && <Text style={styles.errorText}>Please make a selection.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vertical: {
    flexDirection: 'column',
    gap: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 14,
  },
});

export default RadioButtonGroup;
