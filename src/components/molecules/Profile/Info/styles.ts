import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  profileInfo: {
    paddingHorizontal: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  followInfo: {
    flexDirection: 'row',
    gap: 14,
  },
  followCount: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  followNumber: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  followLabel: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});
