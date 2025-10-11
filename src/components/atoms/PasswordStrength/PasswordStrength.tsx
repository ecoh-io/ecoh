// PasswordStrengthMeter.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { PasswordStrengthProps } from './types';
import { styles } from './styles';

/**
 * Quick-n-dirty strength heuristic that returns 0‒N.
 * 0 ─ empty/very weak
 * 1 ─ weak (≥6 chars)
 * 2 ─ medium (+lower+upper or digits)
 * 3 ─ strong (+symbol and ≥8)
 * 4 ─ very strong (≥12, mixed)
 */
function scorePassword(pwd: string): number {
  if (!pwd) return 0;
  let score = 0;

  if (pwd.length >= 6) score++; // length
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++; // cases
  if (/\d/.test(pwd)) score++; // number
  if (/[^a-zA-Z0-9]/.test(pwd)) score++; // symbol
  if (pwd.length >= 12 && score >= 3) score++; // bonus for long + mixed
  return Math.min(score, 4); // cap at 4
}

const COLORS = ['#9E9E9E', '#D32F2F', '#F57C00', '#FBC02D', '#388E3C'];

export default function PasswordStrengthMeter({
  password,
  segments = 4,
  height = 8,
  gap = 4,
}: PasswordStrengthProps) {
  const strength = scorePassword(password); // 0 – 4
  const animatedStrength = useSharedValue(0);

  // run animation on every change
  useEffect(() => {
    animatedStrength.value = withTiming(strength, { duration: 250 });
  }, [strength]);

  // render N equal-width bars
  const bars = Array.from({ length: segments }, (_, i) => {
    const style = useAnimatedStyle(() => {
      /** for discrete fill: bar is “on” if strength ≥ i+1 */
      const on = animatedStrength.value >= i + 1 ? 1 : 0;
      return {
        backgroundColor: interpolateColor(
          on,
          [0, 1],
          ['#E0E0E0', COLORS[Math.min(strength, COLORS.length - 1)]],
        ),
      };
    });
    return (
      <Animated.View
        key={i}
        style={[
          styles.bar,
          style,
          {
            height,
            marginRight: i !== segments - 1 ? gap : 0,
            flex: 1,
          },
        ]}
      />
    );
  });

  return <View style={[styles.container, { height }]}>{bars}</View>;
}
