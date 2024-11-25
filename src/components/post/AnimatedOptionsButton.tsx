import React from 'react';
import { TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Entypo } from '@expo/vector-icons';

interface AnimatedOptionsButtonProps {
  onPress: () => void;
}

const AnimatedOptionsButton: React.FC<AnimatedOptionsButtonProps> = ({
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel="Post options"
      accessibilityRole="button"
    >
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <Entypo name="dots-three-horizontal" size={20} color="#555" />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default AnimatedOptionsButton;
