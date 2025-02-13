import { typography } from '@/src/theme/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  profileDescription: {
    paddingHorizontal: 10,
    flexDirection: 'column',
    gap: 14,
  },
  profileName: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  profileBio: {
    fontSize: typography.fontSizes.button,
    fontFamily: typography.fontFamilies.poppins.medium,
    lineHeight: 25,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 10,
    flexGrow: 0,
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingVertical: 5,
  },
  albumsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});
