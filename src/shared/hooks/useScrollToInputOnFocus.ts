import { useCallback, useRef } from 'react';
import { findNodeHandle, TextInput, ScrollView } from 'react-native';

export const useScrollToInputOnFocus = () => {
  const scrollRef = useRef<ScrollView>(null);

  const handleFocus = useCallback((inputRef: React.RefObject<TextInput>) => {
    requestAnimationFrame(() => {
      const nodeHandle = findNodeHandle(inputRef.current);
      if (nodeHandle && scrollRef.current) {
        scrollRef.current.scrollResponderScrollNativeHandleToKeyboard(
          nodeHandle,
          80, // offset so input isn't flush with keyboard
          true,
        );
      }
    });
  }, []);

  return { scrollRef, handleFocus };
};
