import { typography } from '@/src/theme/typography';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  backButton: {
    flex: 1,
    paddingVertical: 8,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.fontSizes.smallTitle,
    fontWeight: 'bold',
  },
  headerSpacer: {
    flex: 1,
  },
});
