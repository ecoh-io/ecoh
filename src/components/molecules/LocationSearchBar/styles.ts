import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {},
  icon: {
    alignSelf: 'center',
    marginLeft: 6,
  },
  loader: {
    marginVertical: 10,
  },
  listItem: {
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  list: {
    zIndex: 1000,
  },
  searchResult: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});
