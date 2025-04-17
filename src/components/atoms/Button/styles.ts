import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 4,
  },
  label: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  // Shape variants
  rounded: {
    borderRadius: 16,
  },
  pill: {
    borderRadius: 50,
  },
  square: {
    borderRadius: 0,
  },
  // States
  disabled: {
    opacity: 0.6,
  },
});

export const contentSizeStyles = StyleSheet.create({
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
});
