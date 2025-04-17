import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { SegmentedToggleProps } from './types';

const SegmentedToggle: React.FC<SegmentedToggleProps> = ({
  options,
  activeIndex,
  onChange,
}) => {
  const { colors } = useTheme();
  const sliderAnim = useRef(new Animated.Value(0)).current;
  const [segmentWidth, setSegmentWidth] = useState(0);

  useEffect(() => {
    Animated.spring(sliderAnim, {
      toValue: activeIndex * segmentWidth,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [activeIndex, segmentWidth]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const totalWidth = e.nativeEvent.layout.width;
    setSegmentWidth(totalWidth / options.length);
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* Sliding active background */}
      {segmentWidth > 0 && (
        <Animated.View
          style={[
            styles.activeSegment,
            {
              width: segmentWidth - 8,
              transform: [{ translateX: sliderAnim }],
              marginLeft: 4,
            },
          ]}
        />
      )}

      {options.map((option, index) => {
        const isActive = activeIndex === index;
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onChange(index)}
            style={[
              styles.segment,
              {
                backgroundColor: isActive ? colors.testGray : colors.background,
              },
            ]}
            activeOpacity={0.9}
          >
            <Text
              style={[
                isActive ? styles.activeText : styles.inactiveText,
                { color: isActive ? '#000' : colors.onSecondary },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default React.memo(SegmentedToggle);
