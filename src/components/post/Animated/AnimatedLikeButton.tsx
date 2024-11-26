import React, { useEffect } from 'react';
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

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
      <View style={styles.neuomorphicContainer}>
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
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  neuomorphicContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28,
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 6 }, // Downward shadow for depth
    shadowOpacity: 0.3,
    shadowRadius: 4, // Soft spread for shadow
    elevation: 8, // Android shadow effect
  },
  gradientBackground: {
    flex: 1,
    width: 28,
    height: 28,
  },
});

export default React.memo(AnimatedLikeButton);
