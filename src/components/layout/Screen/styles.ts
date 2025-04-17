import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  outer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  inner: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingBottom: 32, // nice breathing space for end-of-page
  },
});
