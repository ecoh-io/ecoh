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

interface AnimatedSaveButtonProps {
  isSaved: boolean;
  onSave: () => void;
}

const AnimatedSaveButton: React.FC<AnimatedSaveButtonProps> = ({
  isSaved,
  onSave,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (isSaved) {
      scale.value = withSequence(
        withTiming(1.5, { duration: 150 }),
        withTiming(1, { duration: 150 }),
      );
    }
  }, [isSaved]);

  const tapGesture = Gesture.Tap().onEnd(() => {
    // Use runOnJS to call the onLike callback on the JS thread
    runOnJS(onSave)();
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[animatedStyle]}>
        {isSaved ? (
          <MaskedView
            maskElement={<FontAwesome name="bookmark" size={24} color="#000" />}
          >
            <LinearGradient
              colors={['#00c6ff', '#0072ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientIconBackground}
            />
          </MaskedView>
        ) : (
          <FontAwesome name="bookmark-o" size={24} color="#828282" />
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  gradientIconBackground: {
    width: 18,
    height: 24,
  },
});

export default React.memo(AnimatedSaveButton);
