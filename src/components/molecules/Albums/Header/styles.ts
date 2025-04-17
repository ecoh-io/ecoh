import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 6,
    marginRight: 4,
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginHorizontal: 10,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginLeft: 10,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  doneButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  doneText: {
    fontSize: 14,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});
