import React, {
  useState,
  memo,
  useMemo,
  useCallback,
  AccessibilityActionEvent,
} from 'react';
import {
  View,
  useWindowDimensions,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { styles } from './styles';
import { MediaPostProps } from './types';
import ParsedTextContent from '@/src/components/molecules/Posts/ParsedTextContent/ParsedTextContent';
import MediaCarousel from '@/src/components/molecules/Posts/Media/MediaCarousel/MediaCarousel';
import { MediaItem } from '@/src/components/molecules/Posts/Media';
import { PaginationIndicator } from '@/src/components/atoms';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
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

  const itemWidth = useMemo(() => width, [width]);
  const itemHeight = useMemo(() => width, [width]);

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  }, []);

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
            color={colors.text}
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
