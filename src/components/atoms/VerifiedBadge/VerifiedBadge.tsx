import React, { memo } from 'react';
import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { styles } from './styles';

const VerifiedBadge: React.FC = () => {
  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel="Verified Badge"
    >
      <MaskedView
        maskElement={
          <FontAwesome name="check-circle" size={14} color="black" />
        }
      >
        <LinearGradient
          colors={['#00c6ff', '#0072ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </MaskedView>
    </View>
  );
};

export default memo(VerifiedBadge);
