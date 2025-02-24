import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  interpolate,
  FadeIn,
  FadeOut,
  Extrapolation,
} from 'react-native-reanimated';

interface BlurBackdropProps {
  animatedIndex: Animated.SharedValue<number>;
}

const BlurBackdrop: React.FC<BlurBackdropProps> = ({ animatedIndex }) => {
  // Define animated style for opacity
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(BlurBackdrop);
