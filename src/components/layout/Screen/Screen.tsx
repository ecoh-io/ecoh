import React, { useEffect, memo, useRef } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useScrollToTop } from '@react-navigation/native';
import { useSafeAreaInsetsStyle } from '@/src/utils/useSafeAreaInsetsStyle';
import { useAutoScrollToggle } from './useAutoScrollToggle';
import { isFixed, ScreenProps } from './types';
import { styles } from './styles';

function FixedScreen({ children, style, contentContainerStyle }: ScreenProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.outer, style]}>
        <View style={[styles.inner, contentContainerStyle]}>{children}</View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function ScrollableScreen(props: ScreenProps) {
  const {
    children,
    contentContainerStyle,
    scrollViewProps,
    keyboardShouldPersistTaps = 'handled',
    preset,
    style,
    scrollToggleThreshold,
  } = props;

  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  const { scrollEnabled, onLayout, onContentSizeChange } = useAutoScrollToggle(
    preset,
    scrollToggleThreshold,
  );

  return (
    <ScrollView
      ref={scrollRef}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      scrollEnabled={scrollEnabled}
      onLayout={(e: LayoutChangeEvent) => {
        onLayout(e);
        scrollViewProps?.onLayout?.(e);
      }}
      onContentSizeChange={(w, h) => {
        onContentSizeChange(w, h);
        scrollViewProps?.onContentSizeChange?.(w, h);
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
}

function Screen(props: ScreenProps) {
  const {
    backgroundColor,
    safeAreaEdges,
    keyboardOffset = 0,
    StatusBarProps,
    statusBarStyle = 'dark',
    KeyboardAvoidingViewProps,
  } = props;

  const safeAreaStyle = useSafeAreaInsetsStyle(safeAreaEdges);

  useEffect(() => Keyboard.dismiss, []);

  return (
    <View style={[styles.container, { backgroundColor }, safeAreaStyle]}>
      <StatusBar style={statusBarStyle} {...StatusBarProps} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
        style={[styles.keyboardAvoidingView, KeyboardAvoidingViewProps?.style]}
        {...KeyboardAvoidingViewProps}
      >
        {isFixed(props.preset) ? (
          <FixedScreen {...props} />
        ) : (
          <ScrollableScreen {...props} />
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

export default memo(Screen);
