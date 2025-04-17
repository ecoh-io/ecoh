import React, { memo, useCallback } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { AnimatedLikeButtonProps } from './types';
import { styles } from './styles';
import AnimatedWrapper from '@/src/animation/AnimatedWrapper';

const AnimatedLikeButton: React.FC<AnimatedLikeButtonProps> = ({
  isLiked,
  onLike,
}) => {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLike();
  }, [onLike, isLiked]);

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
      <TouchableWithoutFeedback onPress={handlePress}>
        {renderIcon()}
      </TouchableWithoutFeedback>
    </AnimatedWrapper>
  );
};

export default memo(AnimatedLikeButton, (prevProps, nextProps) => {
  return prevProps.isLiked === nextProps.isLiked;
});
