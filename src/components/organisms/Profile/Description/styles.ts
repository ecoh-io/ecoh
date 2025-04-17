import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  profileDescription: {
    paddingHorizontal: 16,
    gap: 12,
  },
  profileName: {
    fontSize: 18,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  profileBio: {
    fontSize: 14,
    fontFamily: typography.fontFamilies.poppins.regular,
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  albumsContainer: {
    marginTop: 12,
    paddingBottom: 10,
  },
  albumName: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});
