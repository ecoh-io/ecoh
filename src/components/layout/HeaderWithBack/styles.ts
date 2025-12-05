import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 8,
  },
  backButton: {
    flex: 0,
    marginRight: 8,
  },
  title: {
    fontSize: typography.fontSizes.title,
    fontFamily: typography.fontFamilies.poppins.bold,
  },
});
