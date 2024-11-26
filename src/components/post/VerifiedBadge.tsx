import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

interface VerifiedBadgeProps {}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = () => {
  return (
    <View style={styles.badgeContainer}>
      <MaskedView
        maskElement={<FontAwesome name="check-circle" size={14} color="#000" />}
      >
        <LinearGradient
          colors={['#00c6ff', '#0072ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientIconBackground}
        />
      </MaskedView>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    marginLeft: 4,
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 6 }, // Downward shadow for depth
    shadowOpacity: 0.3,
    shadowRadius: 4, // Soft spread for shadow
    elevation: 8, // Android shadow effect
  },
  gradientIconBackground: {
    width: 24,
    height: 13,
  },
});

export default VerifiedBadge;
