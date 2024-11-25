import React, { useEffect } from 'react';
import { TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';

interface AnimatedLikeButtonProps {
  isLiked: boolean;
  onLike: () => void;
}

const AnimatedLikeButton: React.FC<AnimatedLikeButtonProps> = ({
  isLiked,
  onLike,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (isLiked) {
      scale.value = withSequence(
        withTiming(1.5, { duration: 150 }),
        withTiming(1, { duration: 150 }),
      );
    }
  }, [isLiked]);

  return (
    <TouchableWithoutFeedback
      onPress={onLike}
      accessibilityLabel="Like Button"
      accessibilityRole="button"
    >
      <Animated.View style={[animatedStyle]}>
        <FontAwesome
          name={isLiked ? 'heart' : 'heart-o'}
          size={28}
          color={isLiked ? '#e0245e' : '#555'}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(AnimatedLikeButton);
