import { useWindowDimensions, LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useKeyboardHandler } from 'react-native-keyboard-controller';

interface InputPosition {
  id: string;
  y: number;
  height: number;
}

interface UseKeyboardShiftOptions {
  activeInputId: string | null;
  inputs: InputPosition[];
}

/**
 * Handles non-scrollable keyboard adjustment.
 * Moves container up only when focused input is hidden by keyboard.
 */
export function useKeyboardShift({
  activeInputId,
  inputs,
}: UseKeyboardShiftOptions) {
  const { height: windowHeight } = useWindowDimensions();
  const offset = useSharedValue(0);

  useKeyboardHandler({
    onMove: (event) => {
      if (!activeInputId) return;

      const activeInput = inputs.find((i) => i.id === activeInputId);
      if (!activeInput || !event.height) return;

      const keyboardHeight = event.height;
      const inputBottom = activeInput.y + activeInput.height;
      const visibleArea = windowHeight - keyboardHeight;

      // If inputBottom > visibleArea, it’s obscured by keyboard
      const overlap =
        inputBottom > visibleArea ? inputBottom - visibleArea + 16 : 0;

      offset.value = withTiming(overlap, { duration: 200 });
    },
    onEnd: () => {
      offset.value = withTiming(0, { duration: 200 });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -offset.value }],
  }));

  return animatedStyle;
}

/**
 * Helper to record input position for reuse.
 */
export function recordInputLayout(
  id: string,
  onRecord: (pos: InputPosition) => void,
) {
  return (e: LayoutChangeEvent) => {
    const { y, height } = e.nativeEvent.layout;
    onRecord({ id, y, height });
  };
}
