import { typography } from '@/src/theme/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },
  barContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});
