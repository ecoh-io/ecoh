import React, { useMemo, useCallback } from 'react';
import {
  Text,
  Pressable,
  View,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles, contentSizeStyles } from './styles';
import { ButtonProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
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
  const hasGradient = gradientColors && !isOutlined;

  // ---------- Theme Styles ----------
  const backgroundColor = useMemo(() => {
    if (hasGradient || isOutlined) return 'transparent';
    return colors[variant] ?? colors.primary;
  }, [variant, colors, hasGradient, isOutlined]);

  const textColor = useMemo(() => {
    if (isOutlined) return colors[variant] ?? colors.primary;
    if (variant === 'secondary') return colors.onSecondary;
    return colors.onPrimary;
  }, [isOutlined, variant, colors]);

  const borderColor = isOutlined
    ? colors[variant] ?? colors.primary
    : 'transparent';

  // ---------- Animated Scale ----------
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (disabled || loading) return;
    scale.value = withTiming(0.96, { duration: 100 });
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [disabled, loading, hapticFeedback]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 100 });
  }, []);

  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      onPress?.();
    }
  }, [disabled, loading, onPress]);

  // ---------- Styles ----------
  const buttonStyles: StyleProp<ViewStyle> = useMemo(() => {
    return [
      styles.button,
      styles[shape],
      { backgroundColor, borderColor },
      disabled && styles.disabled,
      style,
    ];
  }, [backgroundColor, borderColor, shape, disabled, style]);

  const contentStyles = useMemo(() => {
    return [styles.content, contentSizeStyles[size], contentStyle];
  }, [size, contentStyle]);

  const labelStyles = useMemo(() => {
    return [styles.label, { color: textColor }, labelStyle];
  }, [textColor, labelStyle]);

  // ---------- Render ----------
  const renderContent = () => (
    <View style={contentStyles}>
      {icon && iconPosition === 'left' && (
        <View style={styles.icon}>{icon}</View>
      )}
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        title && <Text style={labelStyles}>{title}</Text>
      )}
      {icon && iconPosition === 'right' && (
        <View style={styles.icon}>{icon}</View>
      )}
    </View>
  );

  const wrappedContent = hasGradient ? (
    <LinearGradient
      colors={gradientColors!}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.gradient, styles[shape]]}
    >
      {renderContent()}
    </LinearGradient>
  ) : (
    renderContent()
  );

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[buttonStyles, animatedStyle]}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      {...rest}
    >
      {wrappedContent}
    </AnimatedPressable>
  );
};

export default React.memo(Button);
