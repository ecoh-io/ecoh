import React from 'react';
import { View } from 'react-native';
import { PaginationIndicatorProps } from './types';
import { styles } from './styles';

const PaginationIndicator: React.FC<PaginationIndicatorProps> = ({
  count,
  currentIndex,
  color,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentIndex ? color : '#ccc',
              width: index === currentIndex ? 8 : 6,
              height: index === currentIndex ? 8 : 6,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default PaginationIndicator;
