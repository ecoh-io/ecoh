import { typography } from '@/src/theme/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  profileTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
    gap: 5,
  },
  name: {
    fontSize: typography.fontSizes.title,
    fontFamily: typography.fontFamilies.poppins.semiBold,
  },
  username: {
    fontSize: typography.fontSizes.smallTitle,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
});
