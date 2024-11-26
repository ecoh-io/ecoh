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

  return (
    <TouchableWithoutFeedback
      onPress={onSave}
      accessibilityLabel="Save Button"
      accessibilityRole="button"
    >
      <View style={styles.neuomorphicContainer}>
        <Animated.View style={[animatedStyle]}>
          {isSaved ? (
            <MaskedView
              maskElement={
                <FontAwesome name="bookmark" size={24} color="#000" />
              }
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
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  neuomorphicContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    height: 24,
    borderRadius: 30, // Perfectly circular
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 6 }, // Downward shadow for depth
    shadowOpacity: 0.3,
    shadowRadius: 4, // Soft spread for shadow
    elevation: 8, // Android shadow effect
  },
  gradientIconBackground: {
    width: 18,
    height: 24,
  },
});

export default React.memo(AnimatedSaveButton);
