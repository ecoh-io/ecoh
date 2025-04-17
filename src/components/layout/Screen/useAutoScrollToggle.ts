import { useCallback, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { preset } from './types';

export function useAutoScrollToggle(
  preset?: preset,
  threshold?: { percent?: number; point?: number },
) {
  const { percent = 0.92, point = 0 } = threshold || {};
  const viewHeight = useRef<number | null>(null);
  const contentHeight = useRef<number | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const update = useCallback(() => {
    if (viewHeight.current === null || contentHeight.current === null) return;
    const fits = point
      ? contentHeight.current < viewHeight.current - point
      : contentHeight.current < viewHeight.current * percent;
    setScrollEnabled(!(preset === 'auto' && fits));
  }, [percent, point, preset]);

  const onContentSizeChange = useCallback(
    (w: number, h: number) => {
      contentHeight.current = h;
      update();
    },
    [update],
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      viewHeight.current = e.nativeEvent.layout.height;
      update();
    },
    [update],
  );

  return { scrollEnabled, onContentSizeChange, onLayout };
}
