import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.poppins.medium,
    color: '#fff',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 16,
  },
});
