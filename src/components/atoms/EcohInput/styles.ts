import { typography } from '@/src/theme/typography';
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  inputWrapper: {
    position: 'relative',
    height: 54, // same height as your other fields
    borderRadius: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
  },
  iconContainer: {
    // leave empty or size your icon here
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 23,
    color: '#333',
    padding: 0,
    margin: 0,
    height: 54,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  floatingLabel: {
    position: 'absolute',
    top: -8, // sits just above the border
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 1,
    fontSize: 12,
    left: 12,
    color: '#333',
    fontFamily: typography.fontFamilies.poppins.medium,
    pointerEvents: 'none',
  },
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    color: 'red',
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  helperTextRow: {
    flexDirection: 'row',
    width: '90%',
    gap: 4,
    marginTop: 8,
  },
  helperText: {
    fontSize: 12,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  helperIcon: {
    marginRight: 2,
  },
});
