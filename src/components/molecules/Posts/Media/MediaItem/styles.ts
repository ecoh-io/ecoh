import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mediaItemContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    zIndex: 10,
  },
  errorPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
  },
});
