import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface VerifiedBadgeProps {}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = () => {
  return (
    <View style={styles.badgeContainer}>
      <FontAwesome name="check-circle" size={14} color="#1DA1F2" />
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    marginLeft: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VerifiedBadge;
