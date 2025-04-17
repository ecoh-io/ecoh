import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 8,
  },
  headerTextContainer: {
    flex: 1, // This will allow the text container to take up all available space
    alignItems: 'center', // Center the text horizontally
  },
  headerText: {
    fontSize: typography.fontSizes.smallTitle,
    fontFamily: typography.fontFamilies.poppins.bold,
    textAlign: 'center',
  },
  saveButton: {
    paddingVertical: 8,
  },
  saveButtonText: {
    fontFamily: typography.fontFamilies.poppins.medium,
    fontSize: typography.fontSizes.body,
  },
  placeholder: {
    width: 50, // Approximate width of the save button
  },
});
