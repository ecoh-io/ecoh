import { typography } from '@/src/theme/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  profileInfo: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  followCount: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  followInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  followLabel: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: typography.fontSizes.caption,
  },
  followNumber: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.semiBold,
    marginTop: 5,
  },
  itemContainer: {
    padding: 16,
  },
});
