import React, { useMemo, useCallback } from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
  View,
  PressableProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ButtonProps } from './types';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Button: React.FC<ButtonProps & PressableProps> = ({
  title,
  onPress,
  disabled,
  loading = false,
  variant = 'primary',
  size = 'medium',
  shape = 'rounded',
  icon,
  iconPosition = 'left',
  gradientColors,
  style,
  contentStyle,
  labelStyle,
  hapticFeedback = true,
  ...rest
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const isOutlined = variant === 'outlined';

  const backgroundColor = useMemo(() => {
    if (gradientColors) return 'transparent';
    if (isOutlined) return 'transparent';
    return colors[variant] || colors.primary;
  }, [variant, colors, gradientColors, isOutlined]);

  const textColor = useMemo(() => {
    if (isOutlined) return colors[variant] || colors.primary;
    if (variant === 'secondary') return colors.onSecondary;
    return colors.onPrimary;
  }, [isOutlined, variant, colors]);

  const borderColor = useMemo(() => {
    if (isOutlined) return colors[variant] || colors.primary;
    return 'transparent';
  }, [isOutlined, variant, colors]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (!disabled && !loading) {
      scale.value = withTiming(0.96, { duration: 100 });
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, [disabled, loading, scale, hapticFeedback]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 100 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      onPress();
    }
  }, [disabled, loading, onPress]);

  const contentSizes = {
    small: styles.contentSmall,
    medium: styles.contentMedium,
    large: styles.contentLarge,
  };

  const contentStyles = useMemo(
    () => [styles.content, contentSizes[size], contentStyle],
    [size, contentStyle],
  );

  const renderContent = () => (
    <View style={contentStyles}>
      {icon && iconPosition === 'left' && (
        <View style={styles.icon}>{icon}</View>
      )}
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        title && (
          <Text style={[styles.label, { color: textColor }, labelStyle]}>
            {title}
          </Text>
        )
      )}
      {icon && iconPosition === 'right' && (
        <View style={styles.icon}>{icon}</View>
      )}
    </View>
  );

  const buttonStyles: StyleProp<ViewStyle> = useMemo(
    () => [
      styles.button,
      styles[shape],
      { backgroundColor, borderColor },
      disabled && styles.disabled,
      style,
    ],
    [shape, backgroundColor, borderColor, disabled, style],
  );

  const content = useMemo(() => {
    if (gradientColors && !isOutlined) {
      return (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles[shape]]}
        >
          {renderContent()}
        </LinearGradient>
      );
    }
    return renderContent();
  }, [gradientColors, isOutlined, shape, renderContent]);

  return (
    <AnimatedPressable
      style={[buttonStyles, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      {...rest}
    >
      {content}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSmall: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  contentMedium: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  contentLarge: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  icon: {
    marginHorizontal: 4,
  },
  rounded: {
    borderRadius: 16,
  },
  pill: {
    borderRadius: 50,
  },
  square: {
    borderRadius: 0,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default React.memo(Button);
