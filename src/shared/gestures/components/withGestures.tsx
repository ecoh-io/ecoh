import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { View, StyleProp, ViewStyle } from 'react-native';
import { GestureConfig } from '../types';
import { defaultGesturesConfig } from '../config/gesturesConfig';
import { useTapToDismiss } from '../hooks/useTapToDismiss';
import { useSwipeDownToClose } from '../hooks/useSwipeDownToClose';
import { useLongPressFeedback } from '../hooks/useLongPressFeedback';

interface WithGesturesProps {
  /** Optional style for the root GestureDetector view */
  gestureContainerStyle?: StyleProp<ViewStyle>;
  /** Callback for swipe-down close */
  onClose?: () => void;
}

/**
 * Higher-order component that centralizes all gesture logic.
 * Add or remove gesture hooks here to expand global behavior.
 */
export function withGestures<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  configOverrides?: GestureConfig,
) {
  const ComponentWithGestures: React.FC<P & WithGesturesProps> = (props) => {
    const config = { ...defaultGesturesConfig, ...configOverrides };

    // Individual gestures (conditionally enabled)
    const gestures = [];

    if (config.enableTapToDismiss) {
      const { gesture } = useTapToDismiss();
      gestures.push(gesture);
    }

    if (config.enableSwipeDownToClose) {
      const { gesture } = useSwipeDownToClose(props.onClose);
      gestures.push(gesture);
    }

    if (config.enableLongPressFeedback) {
      const { gesture } = useLongPressFeedback();
      gestures.push(gesture);
    }

    // Combine all gestures
    const composedGesture =
      gestures.length > 1
        ? Gesture.Simultaneous(...gestures)
        : (gestures[0] ?? Gesture.Tap()); // fallback

    return (
      <GestureDetector gesture={composedGesture}>
        <View style={props.gestureContainerStyle}>
          <WrappedComponent {...(props as P)} />
        </View>
      </GestureDetector>
    );
  };

  return ComponentWithGestures;
}
