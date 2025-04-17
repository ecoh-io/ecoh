import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import { Easing } from 'react-native-reanimated';
import { AnimatedProgressRingProps } from './types';

const RADIUS = 20;
const STROKE_WIDTH = 4;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedProgressRing: React.FC<AnimatedProgressRingProps> = ({
  progress,
  text,
}) => {
  const { colors } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 600,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <View
      style={{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Svg width={50} height={50}>
        <Defs>
          <LinearGradient id="ecoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00c6ff" />
            <Stop offset="100%" stopColor="#0072ff" />
          </LinearGradient>
        </Defs>

        <Circle
          stroke="#eaeaea"
          fill="none"
          cx={25}
          cy={25}
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
        />

        <AnimatedCircle
          stroke="url(#ecoGradient)"
          fill="none"
          cx={25}
          cy={25}
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 25 25)"
        />
      </Svg>

      <View style={{ position: 'absolute' }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: typography.fontFamilies.poppins.medium,
            color: colors.text,
            opacity: 0.9,
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};

export default AnimatedProgressRing;
