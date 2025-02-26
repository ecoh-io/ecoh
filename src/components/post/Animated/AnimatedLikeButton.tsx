import React, { useCallback } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedWrapper } from '@/src/components/Animations/Animations';
import * as Haptics from 'expo-haptics';

interface AnimatedLikeButtonProps {
  isLiked: boolean;
  onLike: () => void;
}

const AnimatedLikeButton: React.FC<AnimatedLikeButtonProps> = ({
  isLiked,
  onLike,
}) => {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLike();
  }, [onLike]);

  const renderIcon = useCallback(() => {
    return isLiked ? (
      <MaskedView
        maskElement={<AntDesign name="heart" size={19} color="#000" />}
      >
        <LinearGradient
          colors={['#ff7e5f', '#ff3f81', '#ff0000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        />
      </MaskedView>
    ) : (
      <AntDesign name="hearto" size={19} color="black" />
    );
  }, [isLiked]);

  return (
    <AnimatedWrapper
      animation={isLiked ? 'scale-in' : 'scale-out'}
      duration={300}
      visible={true}
    >
      <TouchableWithoutFeedback
        onPress={handlePress}
        style={{ width: 32, height: 32 }}
      >
        {renderIcon()}
      </TouchableWithoutFeedback>
    </AnimatedWrapper>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    width: 19,
    height: 19,
  },
});

export default React.memo(AnimatedLikeButton);
