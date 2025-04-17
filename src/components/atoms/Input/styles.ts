import { StyleSheet } from 'react-native';
import { typography } from '@/src/theme/typography';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginVertical: 8,
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.medium,
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  halo: {
    position: 'absolute',
    top: -4,
    bottom: -4,
    left: 0,
    right: 0,
    borderRadius: 16,
    zIndex: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.fontFamilies.poppins.medium,
    paddingVertical: 4,
    marginHorizontal: 8,
    textAlignVertical: 'center',
  },
  leftAccessory: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 13,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  sendText: {
    fontSize: 13,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  errorText: {
    fontSize: 14,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  helperText: {
    fontSize: 12,
    fontFamily: typography.fontFamilies.poppins.regular,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: typography.fontFamilies.poppins.medium,
  },
  errorChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});
