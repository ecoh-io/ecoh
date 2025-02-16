// EcohDropdown.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  useColorScheme,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import {
  AnimatedWrapper,
  AnimationType,
} from '@/src/components/Animations/Animations';
import { typography } from '@/src/theme/typography';
import { FontAwesome5 } from '@expo/vector-icons';

export interface DropdownOption {
  id: string | number;
  label: string;
  // Extend with additional properties as needed
  [key: string]: any;
}

export interface EcohDropdownProps {
  options: DropdownOption[];
  selected: string | number | Array<string | number> | null;
  onSelect: (value: string | number | Array<string | number>) => void;
  multiSelect?: boolean;
  renderOption?: (
    option: DropdownOption,
    isSelected: boolean,
  ) => React.ReactNode;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

const EcohDropdown: React.FC<EcohDropdownProps> = ({
  options = [],
  selected = null,
  onSelect,
  multiSelect = false,
  renderOption,
  placeholder = 'Select an option',
  style,
}) => {
  // Local state for open/close and highlighted index (for keyboard navigation)
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Shared value for arrow rotation only
  const animation = useSharedValue(0);

  // Use system color scheme (here lightTheme is default)
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? lightTheme : darkTheme;

  // Memoized animation settings for the dropdown list using AnimatedWrapper.
  // Use a slide-up effect for entering and a fade-out for exiting so that
  // the list completely disappears.
  const dropdownAnimationSettings: {
    enterAnimation: AnimationType;
    exitAnimation: AnimationType;
    duration: number;
  } = useMemo(
    () => ({
      enterAnimation: 'fade-in',
      exitAnimation: 'fade-out',
      duration: 600,
    }),
    [],
  );

  // Toggle the dropdown open/close
  const toggleDropdown = () => {
    if (isOpen) {
      // Close: animate arrow rotation back and then close.
      animation.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
      setIsOpen(false);
    } else {
      // Open: reset highlighted index, set open state, animate arrow.
      setIsOpen(true);
      animation.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
    }
  };

  // Handle option selection. In single-select mode, also close the dropdown.
  const handleSelect = (option: DropdownOption) => {
    if (multiSelect) {
      let newSelected: Array<string | number>;
      if (Array.isArray(selected)) {
        if (selected.includes(option.id)) {
          newSelected = selected.filter((id) => id !== option.id);
        } else {
          newSelected = [...selected, option.id];
        }
      } else {
        newSelected = [option.id];
      }
      onSelect(newSelected);
    } else {
      onSelect(option.id);
      // Close dropdown after selection in single-select mode.
      animation.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
      setIsOpen(false);
    }
  };

  // Animate the arrow rotation (from 0deg when closed to 180deg when open)
  const arrowAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(animation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  // Render each option in the dropdown list.
  const renderItem = ({
    item,
    index,
  }: {
    item: DropdownOption;
    index: number;
  }) => {
    const isSelected = multiSelect
      ? Array.isArray(selected) && selected.includes(item.id)
      : selected === item.id;

    return (
      <TouchableOpacity
        style={[styles.optionItem, isSelected && styles.selectedOption]}
        onPress={() => handleSelect(item)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={item.label}
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
  };

  // Determine trigger text based on current selection.
  const triggerText = (): string => {
    if (multiSelect) {
      if (Array.isArray(selected) && selected.length > 0) {
        const firstOption = options.find((opt) => opt.id === selected[0]);
        return firstOption ? firstOption.label : placeholder;
      }
      return placeholder;
    } else {
      const selectedOption = options.find((opt) => opt.id === selected);
      return selectedOption ? selectedOption.label : placeholder;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Dropdown trigger with a higher zIndex to ensure it receives touches */}
      <Pressable
        onPress={toggleDropdown}
        style={[
          styles.trigger,
          { backgroundColor: theme.dropdownBackground, zIndex: 2 },
        ]}
      >
        <Text style={[styles.triggerText, { color: theme.text }]}>
          {triggerText()}
        </Text>
        <Animated.View style={[styles.arrowIcon, arrowAnimatedStyle]}>
          <FontAwesome5 name="chevron-down" size={18} color="#ccc" />
        </Animated.View>
      </Pressable>

      {/* Container for the dropdown list.
          pointerEvents "box-none" ensures that only the dropdown list
          itself intercepts touches, not its container. */}
      <View style={styles.dropdownContainer} pointerEvents="box-none">
        <AnimatedWrapper
          {...dropdownAnimationSettings}
          visible={isOpen}
          style={[styles.dropdown, { pointerEvents: 'auto' }]}
        >
          <FlatList
            data={options}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            style={styles.flatList}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          />
        </AnimatedWrapper>
      </View>
    </View>
  );
};

// Example themes (customize these to match your design system)
const lightTheme = {
  text: '#333',
  dropdownBackground: '#fff',
};

const darkTheme = {
  text: '#fff',
  dropdownBackground: '#333',
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  trigger: {
    paddingHorizontal: 12,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {
    fontSize: 16,
    flex: 1,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%', // positions dropdown immediately below the trigger
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  dropdown: {
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  flatList: {
    borderRadius: 12,
    maxHeight: 225,
  },
  optionItem: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  selectedOption: {
    backgroundColor: '#fff',
  },
});

export default EcohDropdown;
