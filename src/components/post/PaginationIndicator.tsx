import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PaginationIndicatorProps {
  count: number;
  currentIndex: number;
  color: string;
}

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
  },
  dot: {
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default PaginationIndicator;
