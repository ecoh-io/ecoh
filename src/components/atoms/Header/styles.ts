import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamilies.poppins.bold,
    fontSize: typography.fontSizes.title,
  },
  subtitle: {
    fontFamily: typography.fontFamilies.poppins.semiBold,
    fontSize: typography.fontSizes.body,
  },
});
