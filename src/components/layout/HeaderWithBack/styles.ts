import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    flex: 0,
    marginRight: 8,
  },
  title: {
    fontSize: typography.fontSizes.title,
    fontFamily: typography.fontFamilies.poppins.bold,
    marginTop: 2,
  },
});
