import React, { useCallback } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedWrapper } from '@/src/components/Animations/Animations';
import * as Haptics from 'expo-haptics';

interface AnimatedSaveButtonProps {
  isSaved: boolean;
  onSave: () => void;
}

const AnimatedSaveButton: React.FC<AnimatedSaveButtonProps> = ({
  isSaved,
  onSave,
}) => {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSave();
  }, [onSave]);

  const renderIcon = useCallback(() => {
    return isSaved ? (
      <MaskedView
        maskElement={<Ionicons name="bookmark" size={21} color="#000" />}
      >
        <LinearGradient
          colors={['#00c6ff', '#0072ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientIconBackground}
        />
      </MaskedView>
    ) : (
      <Ionicons name="bookmark-outline" size={21} color="black" />
    );
  }, [isSaved]);

  return (
    <AnimatedWrapper
      animation={isSaved ? 'scale-in' : 'scale-out'}
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
  gradientIconBackground: {
    flex: 1,
    width: 21,
    height: 21,
  },
});

export default React.memo(AnimatedSaveButton);
