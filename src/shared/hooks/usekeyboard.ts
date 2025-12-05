import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export function useKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardShown, setKeyboardShown] = useState(false);

  useEffect(() => {
    const onShow = (e: any) => {
      setKeyboardHeight(e.endCoordinates.height);
      setKeyboardShown(true);
    };
    const onHide = () => {
      setKeyboardHeight(0);
      setKeyboardShown(false);
    };

    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { keyboardHeight, keyboardShown };
}
