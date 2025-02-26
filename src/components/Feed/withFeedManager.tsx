// src/components/Feed/withFeedManager.tsx
import React, { useRef, useCallback } from 'react';

export interface FeedManagerProps {
  // Since expo-video doesn't export a specific Video type, we use any or a custom type.
  videoRefs: React.MutableRefObject<{ [key: number]: any }>;
  onViewableItemsChanged: (info: {
    viewableItems: any[];
    changed: any[];
  }) => void;
  viewabilityConfig: { itemVisiblePercentThreshold: number };
}

export function withFeedManager<P extends FeedManagerProps>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function FeedManagerWrapper(props: Omit<P, keyof FeedManagerProps>) {
    // Ref to store expo-video component instances keyed by post id.
    const videoRefs = useRef<{ [key: number]: any }>({});

    // Callback to control video play/pause based on visibility.
    const onViewableItemsChanged = useCallback(
      ({ viewableItems }: { viewableItems: any[]; changed: any[] }) => {
        // Play videos that are fully visible.
        viewableItems.forEach(
          ({ item }: { item: { id: number; type: string } }) => {
            if (item.type === 'video') {
              const videoRef = videoRefs.current[item.id];
              if (videoRef && videoRef.playAsync) {
                videoRef.playAsync();
              }
            }
          },
        );
        // Pause videos that are no longer fully visible.
        Object.keys(videoRefs.current).forEach((idStr) => {
          const id = Number(idStr);
          const stillVisible = viewableItems.find(
            ({ item }: { item: { id: number } }) => item.id === id,
          );
          if (!stillVisible) {
            const videoRef = videoRefs.current[id];
            if (videoRef && videoRef.pauseAsync) {
              videoRef.pauseAsync();
            }
          }
        });
      },
      [],
    );

    const viewabilityConfig = {
      itemVisiblePercentThreshold: 100, // Video will autoplay only when fully visible.
    };

    return (
      <WrappedComponent
        {...(props as P)}
        videoRefs={videoRefs}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    );
  };
}
