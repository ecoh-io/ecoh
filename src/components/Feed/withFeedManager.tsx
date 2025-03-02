// src/components/Feed/withFeedManager.tsx
import { MediaType } from '@/src/enums/media-type.enum';
import { PostData, PostType } from '@/src/types/post';
import React, {
  useRef,
  useCallback,
  MutableRefObject,
  ComponentType,
} from 'react';

/** Interface describing the ref for controlling a video. */
export interface VideoRefHandle {
  playAsync: () => void;
  pauseAsync: () => void;
  current: () => Promise<number>;
  // ... Add more methods if needed
}

/** The shape passed to onViewableItemsChanged by FlatList. */
interface ViewableItemInfo {
  item: PostData;
  index: number | null;
  isViewable: boolean;
  key: string;
}

/**
 * Props that the withFeedManager HOC will inject
 * into the wrapped component.
 */
export interface FeedManagerProps {
  /** If your post IDs are strings, we key them as [postId: string]. */
  videoRefs: MutableRefObject<{ [postId: string]: VideoRefHandle | undefined }>;
  onViewableItemsChanged: (info: {
    viewableItems: ViewableItemInfo[];
    changed: ViewableItemInfo[];
  }) => void;
  viewabilityConfig: {
    itemVisiblePercentThreshold: number;
  };
}

/**
 * Higher-Order Component that manages autoplay/pause of videos
 * based on viewability.
 */
export function withFeedManager<P extends object>(
  WrappedComponent: ComponentType<P & FeedManagerProps>,
) {
  const FeedManagerWrapper: React.FC<P> = (props) => {
    /**
     * Store references to videos keyed by string post ID.
     * e.g., videoRefs.current["abc123"] = { playAsync, pauseAsync }
     */
    const videoRefs = useRef<{
      [postId: string]: VideoRefHandle | undefined;
    }>({});

    /**
     * Callback to control video play/pause based on which items are fully visible.
     * This is passed to the FlatList's onViewableItemsChanged prop in the wrapped component.
     */
    const onViewableItemsChanged = useCallback(
      ({
        viewableItems,
        changed,
      }: {
        viewableItems: ViewableItemInfo[];
        changed: ViewableItemInfo[];
      }) => {
        // Gather the IDs of fully visible items (as strings)
        const visibleIds = new Set(viewableItems.map((vi) => vi.item.id));

        // 1) For each visible post, if it's MEDIA containing a video, play it
        viewableItems.forEach(({ item }) => {
          if (
            item.type === PostType.MEDIA &&
            item.media?.some((m) => m.type === MediaType.VIDEO)
          ) {
            const videoRef = videoRefs.current[item.id];
            if (videoRef?.playAsync) {
              videoRef.playAsync();
            }
          }
        });

        // 2) For every video ref, if the post ID is NOT visible, pause it
        Object.entries(videoRefs.current).forEach(([postId, refHandle]) => {
          if (!visibleIds.has(postId) && refHandle?.pauseAsync) {
            refHandle.pauseAsync();
          }
        });
      },
      [],
    );

    /**
     * Only autoplay when post is 100% visible.
     * You can adjust this to 80 or 90 if you want earlier detection.
     */
    const viewabilityConfig = {
      itemVisiblePercentThreshold: 80,
    };

    return (
      <WrappedComponent
        {...props}
        videoRefs={videoRefs}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    );
  };

  return FeedManagerWrapper;
}
