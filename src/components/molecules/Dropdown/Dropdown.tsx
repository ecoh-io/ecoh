import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  useColorScheme,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { styles } from './styles';
import { DropdownProps, DropdownOption } from './types';
import AnimatedWrapper from '@/src/animation/AnimatedWrapper';

const lightTheme = {
  text: '#333',
  dropdownBackground: '#fff',
  borderColor: '#ccc',
};
const darkTheme = {
  text: '#fff',
  dropdownBackground: '#222',
  borderColor: '#444',
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onSelect,
  multiSelect = false,
  renderOption,
  placeholder = 'Select an option',
  leftIcon,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useSharedValue(0);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const toggleDropdown = () => {
    animation.value = withTiming(isOpen ? 0 : 1, { duration: 200 });
    setIsOpen((prev) => !prev);
  };

  const arrowAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(animation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const handleSelect = (option: DropdownOption) => {
    if (multiSelect) {
      const selectedArr = Array.isArray(selected) ? selected : [];
      const isAlreadySelected = selectedArr.includes(option.id);
      const newSelected = isAlreadySelected
        ? selectedArr.filter((id) => id !== option.id)
        : [...selectedArr, option.id];
      onSelect(newSelected);
    } else {
      onSelect(option.id);
      toggleDropdown();
    }
  };

  const getLabel = (): string => {
    if (multiSelect) {
      if (Array.isArray(selected) && selected.length > 0) {
        const match = options.find((opt) => opt.id === selected[0]);
        return match ? match.label : placeholder;
      }
      return placeholder;
    }
    const match = options.find((opt) => opt.id === selected);
    return match ? match.label : placeholder;
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={toggleDropdown}
        style={[
          styles.trigger,
          {
            backgroundColor: theme.dropdownBackground,
            borderColor: theme.borderColor,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <Text style={[styles.triggerText, { color: theme.text }]}>
          {getLabel()}
        </Text>
        <Animated.View style={[styles.arrowIcon, arrowAnimatedStyle]}>
          <FontAwesome5 name="chevron-down" size={18} color={theme.text} />
        </Animated.View>
      </Pressable>

      {isOpen && (
        <View style={styles.dropdownContainer}>
          <AnimatedWrapper
            visible={isOpen}
            duration={400}
            enterAnimation="fade-in"
            exitAnimation="fade-out"
            style={[
              styles.dropdown,
              { backgroundColor: theme.dropdownBackground },
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => {
                const isSelected = multiSelect
                  ? Array.isArray(selected) && selected.includes(item.id)
                  : selected === item.id;

                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.selectedOption,
                      index === options.length - 1 && styles.lastOptionItem,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    {renderOption ? (
                      renderOption(item, isSelected)
                    ) : (
                      <Text style={[styles.optionText, { color: theme.text }]}>
                        {item.label}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </AnimatedWrapper>
        </View>
      )}
    </View>
  );
};

export default Dropdown;
