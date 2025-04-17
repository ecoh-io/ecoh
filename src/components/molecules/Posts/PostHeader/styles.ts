import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 7,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flexDirection: 'column',
    gap: 2,
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.semiBold,
    maxWidth: '75%',
  },
  userHandle: {
    fontSize: 14,
    fontFamily: typography.fontFamilies.poppins.medium,
    marginTop: 2,
    maxWidth: '75%',
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 14,
    fontFamily: typography.fontFamilies.poppins.regular,
    marginRight: 8,
  },
  rightSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
  },
});
