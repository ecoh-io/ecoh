// CircularProgressIndicator.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { typography } from '@/src/theme/typography';
import { BlurView } from 'expo-blur';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressIndicatorProps {
  size: number;
  strokeWidth: number;
  progress: number;
  gradientColors: string[];
}

const CircularProgressIndicator: React.FC<CircularProgressIndicatorProps> = ({
  size,
  strokeWidth,
  progress,
  gradientColors,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset =
      circumference - (circumference * animatedProgress.value) / 100;
    return {
      strokeDashoffset: strokeDashoffset < 0 ? 0 : strokeDashoffset,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            {gradientColors.map((color, index) => (
              <Stop
                key={index}
                offset={`${(index / (gradientColors.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </LinearGradient>
        </Defs>
        <AnimatedCircle
          stroke="url(#grad)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <BlurView intensity={10} style={styles.blurContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  blurContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    height: '95%',
    borderRadius: 1000, // A large value to ensure it's circular
    overflow: 'hidden',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});

export default CircularProgressIndicator;
