import React from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AnimatedWrapper } from '../../Animations/Animations';

interface AnimatedHeartProps {
  visible: boolean;
}

const AnimatedHeart: React.FC<AnimatedHeartProps> = ({ visible }) => {
  return (
    <AnimatedWrapper
      style={styles.heartContainer}
      visible={visible}
      animation="scale-in"
      duration={300}
    >
      <FontAwesome name="heart" size={50} color="#e0245e" />
    </AnimatedWrapper>
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
