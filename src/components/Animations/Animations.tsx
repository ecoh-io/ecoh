import React, { useEffect, useMemo, useState } from 'react';
import type { ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

/** Supported animation types (including custom ones for the rotating icon) */

export type AnimationType =
  | 'fade-in'
  | 'slide-up'
  | 'scale-in'
  | 'rotate-in'
  | 'plus-to-cross'
  | 'fade-out'
  | 'slide-out'
  | 'scale-out'
  | 'rotate-out'
  | 'cross-to-plus'
  | 'pulse'
  | 'bounce'
  | 'floating';

/**
 * Returns the initial (starting) values for a given animation type.
 *
 * For rotation, the value is in degrees.
 */
const getInitialValues = (
  type: AnimationType,
): {
  opacity?: number;
  translateY?: number;
  scale?: number;
  rotate?: number;
} => {
  switch (type) {
    case 'fade-in':
      return { opacity: 0 };
    case 'slide-up':
      return { translateY: 50 };
    case 'scale-in':
      return { scale: 0.8 };
    case 'rotate-in':
      return { rotate: 90 };
    case 'plus-to-cross': // plus starts at 0° (a plus icon)
      return { rotate: 0 };
    // For exit animations we assume the element is already visible.
    case 'fade-out':
      return { opacity: 1 };
    case 'slide-out':
      return { translateY: 0 };
    case 'scale-out':
      return { scale: 1 };
    case 'rotate-out':
      return { rotate: 0 };
    case 'cross-to-plus': // cross starts at 45° (a rotated plus)
      return { rotate: 45 };
    default:
      return {};
  }
};

/**
 * Returns the final (target) values for a given animation type.
 */
const getFinalValues = (
  type: AnimationType,
): {
  opacity?: number;
  translateY?: number;
  scale?: number;
  rotate?: number;
} => {
  switch (type) {
    case 'fade-in':
      return { opacity: 1 };
    case 'slide-up':
      return { translateY: 0 };
    case 'scale-in':
      return { scale: 1 };
    case 'rotate-in':
      return { rotate: 0 };
    case 'plus-to-cross': // rotate the plus into a cross (45° rotation)
      return { rotate: 45 };
    case 'fade-out':
      return { opacity: 0 };
    case 'slide-out':
      return { translateY: 50 };
    case 'scale-out':
      return { scale: 0.8 };
    case 'rotate-out':
      return { rotate: -90 };
    case 'cross-to-plus': // rotate the cross back into a plus (0° rotation)
      return { rotate: 0 };
    default:
      return {};
  }
};

/**
 * Helper: Given an animation (e.g., "plus-to-cross"), returns its opposite.
 */
const getOppositeAnimation = (animation: AnimationType): AnimationType => {
  switch (animation) {
    case 'fade-in':
      return 'fade-out';
    case 'fade-out':
      return 'fade-in';
    case 'slide-up':
      return 'slide-out';
    case 'slide-out':
      return 'slide-up';
    case 'scale-in':
      return 'scale-out';
    case 'scale-out':
      return 'scale-in';
    case 'rotate-in':
      return 'rotate-out';
    case 'rotate-out':
      return 'rotate-in';
    case 'plus-to-cross':
      return 'cross-to-plus';
    case 'cross-to-plus':
      return 'plus-to-cross';
    default:
      return animation;
  }
};

export interface AnimatedWrapperProps {
  visible?: boolean;
  enterAnimation?: AnimationType;
  exitAnimation?: AnimationType;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = (props) => {
  const {
    visible,
    enterAnimation,
    exitAnimation,
    animation,
    duration = 300,
    delay = 0,
    easing,
    style,
    children,
  } = props;

  // Memoize easing so its reference is stable.
  const stableEasing = useMemo(
    () => easing || Easing.out(Easing.exp),
    [easing],
  );
  const isVisible = visible !== undefined ? visible : true;
  const [shouldRender, setShouldRender] = useState(isVisible);

  const enterAnim: AnimationType = enterAnimation || animation || 'fade-in';
  const exitAnim: AnimationType =
    exitAnimation || (animation ? getOppositeAnimation(animation) : 'fade-out');

  const initialEnterValues = getInitialValues(enterAnim);
  const initialExitValues = getFinalValues(exitAnim);

  // For each property, if not defined for the enter animation, default to the “visible” value.
  const opacity = useSharedValue(
    isVisible
      ? initialEnterValues.opacity ?? 1
      : initialExitValues.opacity ?? 1,
  );
  const translateY = useSharedValue(
    isVisible
      ? initialEnterValues.translateY ?? 0
      : initialExitValues.translateY ?? 0,
  );
  const scale = useSharedValue(
    isVisible ? initialEnterValues.scale ?? 1 : initialExitValues.scale ?? 1,
  );
  const rotate = useSharedValue(
    isVisible ? initialEnterValues.rotate ?? 0 : initialExitValues.rotate ?? 0,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const init = getInitialValues(enterAnim);
      // **Ensure opacity is explicitly set to 1 if not defined by the enter animation.**
      if (init.opacity !== undefined) {
        opacity.value = init.opacity;
      } else {
        opacity.value = 1;
      }
      if (init.translateY !== undefined) translateY.value = init.translateY;
      if (init.scale !== undefined) scale.value = init.scale;
      if (init.rotate !== undefined) rotate.value = init.rotate;

      const finalEnter = getFinalValues(enterAnim);
      if (finalEnter.opacity !== undefined) {
        opacity.value = withDelay(
          delay,
          withTiming(finalEnter.opacity, { duration, easing: stableEasing }),
        );
      }
      if (finalEnter.translateY !== undefined) {
        translateY.value = withDelay(
          delay,
          withTiming(finalEnter.translateY, { duration, easing: stableEasing }),
        );
      }
      if (finalEnter.scale !== undefined) {
        scale.value = withDelay(
          delay,
          withTiming(finalEnter.scale, { duration, easing: stableEasing }),
        );
      }
      if (finalEnter.rotate !== undefined) {
        rotate.value = withDelay(
          delay,
          withTiming(finalEnter.rotate, { duration, easing: stableEasing }),
        );
      }
    } else {
      const finalExit = getFinalValues(exitAnim);
      if (finalExit.opacity !== undefined) {
        opacity.value = withDelay(
          delay,
          withTiming(
            finalExit.opacity,
            { duration, easing: stableEasing },
            (finished) => {
              if (finished) runOnJS(setShouldRender)(false);
            },
          ),
        );
      }
      if (finalExit.translateY !== undefined) {
        translateY.value = withDelay(
          delay,
          withTiming(finalExit.translateY, { duration, easing: stableEasing }),
        );
      }
      if (finalExit.scale !== undefined) {
        scale.value = withDelay(
          delay,
          withTiming(finalExit.scale, { duration, easing: stableEasing }),
        );
      }
      if (finalExit.rotate !== undefined) {
        rotate.value = withDelay(
          delay,
          withTiming(finalExit.rotate, { duration, easing: stableEasing }),
        );
      }
    }
  }, [
    isVisible,
    delay,
    duration,
    stableEasing,
    enterAnim,
    exitAnim,
    opacity,
    translateY,
    scale,
    rotate,
  ]);

  if (!shouldRender) return null;
  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};
