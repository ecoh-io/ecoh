import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '@/src/theme/ThemeContext';
import { usePasswordStrength } from './usePasswordStrength';
import { styles } from './styles';
import { PasswordStrengthProps } from './types';

const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  formik,
  name,
  isFocused,
}) => {
  const { colors } = useTheme();

  const password = formik.values[name] ?? '';
  const error = formik.errors[name];
  const touched = formik.touched[name];

  const showError = !!(touched && error);
  const shouldAnimate = isFocused || !!password;

  const { level, score } = usePasswordStrength(password);

  const segmentColorMap = {
    default: colors.secondary, // neutral gray
    'Too Weak': '#F4AABF', // soft red/pink
    Weak: colors.error,
    Medium: colors.warning,
    Strong: colors.success,
    'Very Strong': '#3366FF',
  };

  const segmentProgress = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  const customEase = Easing.bezier(0.25, 0.1, 0.25, 1);

  useEffect(() => {
    segmentProgress.forEach((progress, i) => {
      const isActive = shouldAnimate && i < score;
      const delay = i * 80;

      progress.value = withDelay(
        delay,
        withTiming(isActive ? 1 : 0, {
          duration: 400,
          easing: customEase,
        }),
      );
    });
  }, [score, shouldAnimate]);

  const renderSegments = () =>
    segmentProgress.map((progress, i) => {
      const animatedStyle = useAnimatedStyle(() => ({
        opacity: progress.value * 0.6 + 0.4,
        backgroundColor: showError
          ? colors.error
          : segmentColorMap[password ? level : 'default'],
      }));

      return <Animated.View key={i} style={[styles.segment, animatedStyle]} />;
    });

  const labelColor = useSharedValue(0);
  const levelKeys = Object.keys(segmentColorMap).filter((k) => k !== 'default');

  useEffect(() => {
    const newIndex = levelKeys.indexOf(level);
    if (newIndex !== -1) {
      labelColor.value = withTiming(newIndex, {
        duration: 400,
        easing: customEase,
      });
    }
  }, [level]);

  const animatedLabelStyle = useAnimatedStyle(() => {
    const inputRange = levelKeys.map((_, i) => i);
    const outputRange = levelKeys.map(
      (key) => segmentColorMap[key as keyof typeof segmentColorMap],
    );

    return {
      color: showError
        ? colors.error
        : password
        ? interpolateColor(labelColor.value, inputRange, outputRange)
        : colors.secondary,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>{renderSegments()}</View>
      <Animated.Text style={[styles.label, animatedLabelStyle]}>
        {showError ? error : password ? level : 'Password strength'}
      </Animated.Text>
    </View>
  );
};

export default React.memo(PasswordStrength);
