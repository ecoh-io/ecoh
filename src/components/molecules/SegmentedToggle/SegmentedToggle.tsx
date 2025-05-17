import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { SegmentedToggleProps } from './types';
import * as Haptics from 'expo-haptics';

const SegmentedToggle: React.FC<SegmentedToggleProps> = ({
  options,
  activeIndex,
  onChange,
}) => {
  const { colors } = useTheme();

  const [segmentLayouts, setSegmentLayouts] = useState<number[]>([]);
  const translateX = useSharedValue(0);
  const segmentWidth = useSharedValue(0);

  useEffect(() => {
    if (segmentLayouts.length === options.length) {
      const offset = segmentLayouts
        .slice(0, activeIndex)
        .reduce((acc, w) => acc + w, 0);
      translateX.value = withTiming(offset, {
        duration: 200,
        easing: Easing.out(Easing.exp),
      });
      segmentWidth.value = withTiming(segmentLayouts[activeIndex], {
        duration: 200,
        easing: Easing.out(Easing.exp),
      });
    }
  }, [activeIndex, segmentLayouts]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: segmentWidth.value,
  }));

  const handleLayout = (index: number, width: number) => {
    setSegmentLayouts((prev) => {
      const updated = [...prev];
      updated[index] = width;
      return updated;
    });
  };

  return (
    <View style={styles.container}>
      {segmentLayouts.length === options.length && (
        <Animated.View style={[styles.activeSegment, animatedStyle]} />
      )}

      {options.map((option, index) => {
        const isActive = index === activeIndex;

        return (
          <TouchableOpacity
            key={option.label}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(index);
            }}
            style={styles.segment}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onLayout={(e) => handleLayout(index, e.nativeEvent.layout.width)}
          >
            <View style={styles.iconLabelWrapper}>
              {option.icon && (
                <View style={styles.iconWrapper}>{option.icon}</View>
              )}
              <Text
                style={[isActive ? styles.activeText : styles.inactiveText]}
              >
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default React.memo(SegmentedToggle);
