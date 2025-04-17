import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { RadioButtonProps } from './types';

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  selected,
  onPress,
  size = 24,
  activeColor,
  inactiveColor,
  disabled = false,
  style,
  labelStyle,
  error = false,
}) => {
  const { colors } = useTheme();

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (selected) {
      scale.value = withSpring(1.2, { damping: 10 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      scale.value = withTiming(1, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [selected]);

  const animatedInnerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const borderColor = error
    ? colors.error
    : selected
    ? activeColor || colors.text
    : inactiveColor || colors.placeholder;

  const innerColor = selected ? activeColor || colors.text : 'transparent';
  const textColor = error ? colors.error : colors.text;

  return (
    <TouchableOpacity
      style={[styles.container, style, disabled && styles.disabled]}
      onPress={disabled ? undefined : onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <Text style={[styles.radioText, { color: textColor }, labelStyle]}>
        {label}
      </Text>
      <View
        style={[
          styles.radioCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor,
          },
        ]}
      >
        {selected && (
          <Animated.View
            style={[
              styles.selectedRb,
              {
                backgroundColor: innerColor,
                width: size / 2,
                height: size / 2,
                borderRadius: size / 4,
              },
              animatedInnerStyle,
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
