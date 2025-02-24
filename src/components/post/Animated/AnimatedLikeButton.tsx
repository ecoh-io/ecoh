import React, { useEffect } from 'react';
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

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

  const tapGesture = Gesture.Tap().onEnd(() => {
    // Use runOnJS to call the onLike callback on the JS thread
    runOnJS(onLike)();
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[animatedStyle]}>
        {isLiked ? (
          <MaskedView
            maskElement={<FontAwesome name="heart" size={28} color="#000" />}
          >
            <LinearGradient
              colors={['#ff7e5f', '#ff3f81', '#ff0000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            />
          </MaskedView>
        ) : (
          <FontAwesome name="heart-o" size={28} color="#555" />
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    width: 28,
    height: 28,
  },
});

export default React.memo(AnimatedLikeButton);
