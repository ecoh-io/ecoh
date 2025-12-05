// styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1, // 👈 absolutely required
    justifyContent: 'flex-start', // allow upward shift
  },
});
