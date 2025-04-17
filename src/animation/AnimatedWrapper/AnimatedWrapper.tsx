import React, { useEffect, useMemo, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { AnimatedWrapperProps } from './types';
import {
  getInitialValues,
  getFinalValues,
  getOppositeAnimation,
} from './utils';

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  visible,
  enterAnimation,
  exitAnimation,
  animation,
  duration = 300,
  delay = 0,
  easing,
  style,
  children,
}) => {
  const stableEasing = useMemo(
    () => easing || Easing.out(Easing.exp),
    [easing],
  );
  const isVisible = visible !== undefined ? visible : true;
  const [shouldRender, setShouldRender] = useState(isVisible);

  const enterAnim = enterAnimation || animation || 'fade-in';
  const exitAnim =
    exitAnimation || (animation ? getOppositeAnimation(animation) : 'fade-out');

  const initialEnterValues = getInitialValues(enterAnim);
  const initialExitValues = getFinalValues(exitAnim);

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

      if (init.opacity !== undefined) opacity.value = init.opacity;
      else opacity.value = 1;

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
            (finished) => finished && runOnJS(setShouldRender)(false),
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

export default AnimatedWrapper;
