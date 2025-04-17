import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    gap: 4,
  },
  countryFlag: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.bold,
    textAlign: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.medium,
    marginRight: 8,
    textAlign: 'center',
  },
  dividerStyle: {
    width: 2,
    height: '80%',
    borderRadius: 12,
  },
});
