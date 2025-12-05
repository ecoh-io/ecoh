import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { View } from 'react-native';
import { styles } from '../inputs/input/styles';

interface ValidationIconProps {
  valid: boolean;
  invalid: boolean;
  colors: { error: string; valid: string };
}

export const ValidationIcon: React.FC<ValidationIconProps> = ({
  valid,
  invalid,
  colors,
}) => {
  const checkOpacity = useSharedValue(valid ? 1 : 0);
  const crossOpacity = useSharedValue(invalid ? 1 : 0);
  const checkScale = useSharedValue(valid ? 1 : 0.85);
  const crossScale = useSharedValue(invalid ? 1 : 0.85);

  useEffect(() => {
    const fade = (opacity: any, scale: any, show: boolean) => {
      opacity.value = withTiming(show ? 1 : 0, { duration: 180 });
      if (show) {
        scale.value = withSequence(
          withTiming(0.85, { duration: 80, easing: Easing.out(Easing.cubic) }),
          withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) }),
        );
      }
    };
    fade(checkOpacity, checkScale, valid);
    fade(crossOpacity, crossScale, invalid);
  }, [valid, invalid]);

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  const crossStyle = useAnimatedStyle(() => ({
    opacity: crossOpacity.value,
    transform: [{ scale: crossScale.value }],
  }));

  return (
    <View style={styles.validationIconContainer}>
      <Animated.View style={[styles.validationIcon, crossStyle]}>
        <FontAwesome5 name="times" size={18} color={colors.error} />
      </Animated.View>
      <Animated.View style={[styles.validationIcon, checkStyle]}>
        <FontAwesome5 name="check" size={18} color={colors.valid} />
      </Animated.View>
    </View>
  );
};
