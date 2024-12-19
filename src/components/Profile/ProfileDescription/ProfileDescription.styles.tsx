import { typography } from '@/src/theme/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  profileDescription: {
    paddingHorizontal: 10,
  },
  profileName: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  profileBio: {
    fontSize: typography.fontSizes.button,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});
