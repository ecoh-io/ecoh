import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

const HEADER_HEIGHT = 60;

export const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 100,
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamilies.poppins.bold,
    fontSize: typography.fontSizes.title,
  },
  headerIcon: {
    padding: 8,
    borderRadius: 20,
  },
});
