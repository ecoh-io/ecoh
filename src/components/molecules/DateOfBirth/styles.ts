import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    position: 'absolute',
    top: -6, // sits just above the border
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 1,
    fontSize: 12,
    left: 14,
    color: '#333',
    fontFamily: typography.fontFamilies.poppins.medium,
    pointerEvents: 'none',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  icon: {
    marginRight: 10,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 23,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  helperTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helperText: {
    fontSize: 12,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  helperIcon: {
    marginRight: 2,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    color: 'red',
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  errorChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});
