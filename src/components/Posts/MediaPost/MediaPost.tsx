// src/components/MediaPost/index.tsx
import React, { useState, memo, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableWithoutFeedback,
  AccessibilityActionEvent,
} from 'react-native';
import { MediaPost } from '@/src/types/post';
import { useTheme } from '@/src/theme/ThemeContext'; // If you have theming
import MediaItem from './MediaItem';
import MediaCarousel from './MediaCarousel';
import PaginationIndicator from './PaginationIndicator';
import ActionBar, { ActionBarProps } from '../ActionBar';
import { VideoRefHandle } from '../../Feed/withFeedManager';
import { typography } from '@/src/theme/typography';
import ParsedTextContent from '../TextPost/ParsedTextContent';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MediaPostProps
  extends Omit<ActionBarProps, 'likes' | 'commentsCount' | 'echoCount'> {
  post: MediaPost;
  onVideoRefReady: (videoRef: VideoRefHandle | null) => void;
  onHashtagPress?: (hashtag: string) => void;
  onMentionPress?: (mention: string) => void;
  onLinkPress?: (url: string) => void;
  renderActionBar?: () => React.ReactNode;
}

const MediaPostComponent: React.FC<MediaPostProps> = ({
  post,
  onVideoRefReady,
  onHashtagPress,
  onMentionPress,
  onLinkPress,
  renderActionBar,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [isExpanded, setIsExpanded] = useState(false);
  const { media } = post;

  // For a square-ish display, we make itemWidth == screen width,
  // and itemHeight == screen width. Adjust as needed.
  const itemWidth = useMemo(() => width, [width]);
  const itemHeight = useMemo(() => width, [width]);

  /**
   * Expand/collapse text with a layout animation
   */
  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  }, []);

  /**
   * Accessibility action (e.g., "activate" to expand)
   */
  const handleAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      if (event.nativeEvent.actionName === 'activate') {
        toggleExpanded();
      }
    },
    [toggleExpanded],
  );

  const renderSingleMedia = () => (
    <MediaItem item={media[0]} onVideoRefReady={onVideoRefReady} />
  );

  const renderCarousel = () => (
    <MediaCarousel
      data={media}
      itemWidth={itemWidth}
      itemHeight={itemHeight}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      onVideoRefReady={onVideoRefReady}
    />
  );

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.mediaContainer,
          {
            width: itemWidth,
            height: itemHeight,
            backgroundColor: colors.background,
          },
        ]}
      >
        {media.length === 1 ? renderSingleMedia() : renderCarousel()}
      </View>

      <View style={{ marginHorizontal: 10 }}>
        {media.length > 1 && (
          <PaginationIndicator
            count={media.length}
            currentIndex={currentIndex}
            color={colors.secondary}
          />
        )}
        {renderActionBar && renderActionBar()}
        <TouchableWithoutFeedback
          onPress={toggleExpanded}
          accessibilityRole="button"
          accessibilityLabel={
            isExpanded
              ? 'Post content expanded. Long press to like.'
              : 'Post content. Long press to like. Tap to expand.'
          }
          accessibilityHint="Long press to like this post. Tap to expand or collapse."
          onAccessibilityAction={handleAccessibilityAction}
          accessibilityActions={[{ name: 'activate' }]}
        >
          <ParsedTextContent
            text={post.content}
            isExpanded={isExpanded}
            onHashtagPress={onHashtagPress}
            onMentionPress={onMentionPress}
            onLinkPress={onLinkPress}
            color={colors.text} // from your theme
          />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default memo(MediaPostComponent, (prev, next) => {
  return (
    prev.post.id === next.post.id &&
    prev.isLiked === next.isLiked &&
    prev.isSaved === next.isSaved &&
    prev.post.media.length === next.post.media.length &&
    prev.post.media.every((m, idx) => {
      const nextM = next.post.media[idx];
      return m.url === nextM.url && m.type === nextM.type;
    })
  );
});

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    flexDirection: 'column',
    gap: 14,
  },
  mediaContainer: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  textContent: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: typography.fontFamilies.poppins.regular,
  },
});
