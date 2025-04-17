import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  imageContainer: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    left: '50%',
    marginLeft: -10,
  },
  errorContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -40,
    width: 80,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  title: {
    fontSize: typography.fontSizes.body,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  description: {
    fontSize: typography.fontSizes.button,
    fontFamily: typography.fontFamilies.poppins.regular,
  },
  domain: {
    fontSize: typography.fontSizes.caption,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});
