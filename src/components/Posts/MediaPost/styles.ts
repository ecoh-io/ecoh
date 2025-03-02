// src/components/MediaPost/styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mediaItemContainer: {
    overflow: 'hidden',
    borderRadius: 21,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
  errorPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#666', // fallback color or image
  },
});
