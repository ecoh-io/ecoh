import React from 'react';
import { View, TextStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Octicons } from '@expo/vector-icons';
import { styles } from '../inputs/input/styles';

interface HelperTextProps {
  iconTint: string;
  animatedStyle: AnimatedStyle<TextStyle>;
  text: string;
}

export const HelperText: React.FC<HelperTextProps> = ({
  iconTint,
  animatedStyle,
  text,
}) => (
  <View style={styles.helperTextRow}>
    <Octicons name="info" size={16} color={iconTint} />
    <Animated.Text style={[styles.helperText, animatedStyle]}>
      {text}
    </Animated.Text>
  </View>
);
