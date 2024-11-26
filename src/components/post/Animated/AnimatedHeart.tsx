import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';

interface AnimatedHeartProps {
  visible: boolean;
  onAnimationComplete: () => void;
}

const AnimatedHeart: React.FC<AnimatedHeartProps> = ({
  visible,
  onAnimationComplete,
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1.5, { duration: 300 }, () => {
        opacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(onAnimationComplete)();
        });
      });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.heartContainer, animatedStyle]}>
      <FontAwesome name="heart" size={50} color="#e0245e" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  heartContainer: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default React.memo(AnimatedHeart);
