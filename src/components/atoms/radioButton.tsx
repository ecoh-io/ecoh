import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: (event: GestureResponderEvent) => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  iconName?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  error?: boolean;
}

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

  // Animated values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  // Update animated values based on selection
  React.useEffect(() => {
    if (selected) {
      scale.value = withSpring(1.2, { damping: 10 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      scale.value = withTiming(1, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [selected, scale, opacity]);

  // Animated styles
  const animatedInnerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Determine colors based on props and theme
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
            borderColor: borderColor,
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
          ></Animated.View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingLeft: 8,
  },
  radioCircle: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedRb: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioText: {
    flex: 1,
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default RadioButton;
