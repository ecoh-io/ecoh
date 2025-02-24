import React, { useCallback, useEffect, useRef, useState, memo } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { StatusBar, StatusBarProps } from 'expo-status-bar';
import {
  useSafeAreaInsetsStyle,
  ExtendedEdge,
} from '@/src/utils/useSafeAreaInsetsStyle';
import { useScrollToTop } from '@react-navigation/native';
import { BaseScreenProps } from './types';

// -------------------------
// Types & Interfaces
// -------------------------
interface FixedScreenProps extends BaseScreenProps {
  preset?: 'fixed';
}

interface ScrollScreenProps extends BaseScreenProps {
  preset?: 'scroll';
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never';
  scrollViewProps?: ScrollViewProps;
}

interface AutoScreenProps extends Omit<ScrollScreenProps, 'preset'> {
  preset?: 'auto';
  /** Toggle scrolling when content is shorter than the threshold (percentage or fixed point) */
  scrollEnabledToggleThreshold?: { percent?: number; point?: number };
}

export type ScreenProps =
  | ScrollScreenProps
  | FixedScreenProps
  | AutoScreenProps;

// -------------------------
// Utility Hook: Auto Scroll Preset
// -------------------------
function useAutoScrollPreset(
  preset: AutoScreenProps['preset'],
  toggleThreshold?: AutoScreenProps['scrollEnabledToggleThreshold'],
) {
  const { percent = 0.92, point = 0 } = toggleThreshold || {};
  const scrollViewHeight = useRef<number | null>(null);
  const scrollViewContentHeight = useRef<number | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const updateScrollState = useCallback(() => {
    if (
      scrollViewHeight.current === null ||
      scrollViewContentHeight.current === null
    ) {
      return;
    }
    // Determine if content fits the screen without scrolling.
    const contentFitsScreen = point
      ? scrollViewContentHeight.current < scrollViewHeight.current - point
      : scrollViewContentHeight.current < scrollViewHeight.current * percent;
    setScrollEnabled(!(preset === 'auto' && contentFitsScreen));
  }, [percent, point, preset]);

  const onContentSizeChange = useCallback(
    (w: number, h: number) => {
      scrollViewContentHeight.current = h;
      updateScrollState();
    },
    [updateScrollState],
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      scrollViewHeight.current = e.nativeEvent.layout.height;
      updateScrollState();
    },
    [updateScrollState],
  );

  return {
    scrollEnabled: preset === 'auto' ? scrollEnabled : true,
    onContentSizeChange,
    onLayout,
  };
}

// -------------------------
// Fixed Screen (Non-Scrolling)
// -------------------------
const FixedScreen = memo(function FixedScreen({
  style,
  contentContainerStyle,
  children,
}: FixedScreenProps) {
  const dismissKeyboard = useCallback(() => Keyboard.dismiss(), []);
  return (
    <TouchableWithoutFeedback
      style={[styles.outer, style]}
      onPress={dismissKeyboard}
    >
      <View style={[styles.inner, contentContainerStyle]}>{children}</View>
    </TouchableWithoutFeedback>
  );
});

// -------------------------
// Scrollable Screen
// -------------------------
const ScrollableScreen = memo(function ScrollableScreen(
  props: ScrollScreenProps | AutoScreenProps,
) {
  const {
    children,
    keyboardShouldPersistTaps = 'handled',
    contentContainerStyle,
    scrollViewProps,
    style,
    preset,
  } = props;

  const scrollViewRef = useRef<ScrollView>(null);
  useScrollToTop(scrollViewRef);

  const { scrollEnabled, onContentSizeChange, onLayout } = useAutoScrollPreset(
    preset as AutoScreenProps['preset'],
    (props as AutoScreenProps).scrollEnabledToggleThreshold,
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      scrollEnabled={scrollEnabled}
      onContentSizeChange={(w, h) => {
        onContentSizeChange(w, h);
        scrollViewProps?.onContentSizeChange?.(w, h);
      }}
      onLayout={(e) => {
        onLayout(e);
        scrollViewProps?.onLayout?.(e);
      }}
      style={[styles.outer, scrollViewProps?.style, style]}
      contentContainerStyle={[
        styles.inner,
        scrollViewProps?.contentContainerStyle,
        contentContainerStyle,
      ]}
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  );
});

// -------------------------
// Main Screen Component
// -------------------------
export default function Screen(props: ScreenProps) {
  const {
    backgroundColor,
    keyboardOffset = 0,
    safeAreaEdges,
    StatusBarProps,
    statusBarStyle,
    KeyboardAvoidingViewProps,
  } = props;

  const safeAreaStyle = useSafeAreaInsetsStyle(safeAreaEdges);

  useEffect(() => {
    return () => Keyboard.dismiss();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor }, safeAreaStyle]}>
      <StatusBar style={statusBarStyle} {...StatusBarProps} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
        style={[styles.keyboardAvoidingView, KeyboardAvoidingViewProps?.style]}
        {...KeyboardAvoidingViewProps}
      >
        {isNonScrolling(props.preset) ? (
          <FixedScreen {...(props as FixedScreenProps)} />
        ) : (
          <ScrollableScreen {...(props as ScrollScreenProps)} />
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

// -------------------------
// Helper: Determine if Screen is Non-Scrolling
// -------------------------
function isNonScrolling(preset?: ScreenProps['preset']) {
  return !preset || preset === 'fixed';
}

// -------------------------
// Styles
// -------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  } as ViewStyle,
  keyboardAvoidingView: {
    flex: 1,
  } as ViewStyle,
  outer: {
    flex: 1,
    height: '100%',
    width: '100%',
  } as ViewStyle,
  inner: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  } as ViewStyle,
});
