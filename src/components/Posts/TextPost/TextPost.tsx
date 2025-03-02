// src/components/TextPost/index.tsx
import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  AccessibilityActionEvent,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { TextPost } from '@/src/types/post'; // or wherever you store your types
import { useTheme } from '@/src/theme/ThemeContext'; // if you have a theme
import { useLinkPreviews } from '@/src/hooks/useLinkPreviews'; // fetch link previews
import { extractUrls } from '@/src/utils/urlHelpers';
import ParsedTextContent from './ParsedTextContent';
import { styles } from './styles';
import LinkPreview from './LinkPreview';
import ActionBar, { ActionBarProps } from '../ActionBar';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface TextPostProps extends ActionBarProps {
  post: TextPost;
  onDoubleTap?: () => void;
  onHashtagPress?: (hashtag: string) => void;
  onMentionPress?: (mention: string) => void;
  onLinkPress?: (url: string) => void;
}

const TextPostComponent: React.FC<TextPostProps> = ({
  post,
  onLike,
  onHashtagPress,
  onMentionPress,
  onLinkPress,
  onCommentPress,
  onShare,
  onSave,
}) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const { comments, isLiked, isSaved, likes, echo } = post;

  // Extract URLs from the post content
  const urls = useMemo(() => extractUrls(post.content), [post.content]);

  // Fetch metadata for extracted URLs
  const { previews, loading, error } = useLinkPreviews(urls);

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

  return (
    <View style={styles.container}>
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
        <View style={styles.textContainer}>
          {/* Parsed text content (hashtags, mentions, links, etc.) */}
          <ParsedTextContent
            text={post.content}
            isExpanded={isExpanded}
            onHashtagPress={onHashtagPress}
            onMentionPress={onMentionPress}
            onLinkPress={onLinkPress}
            color={colors.text} // from your theme
          />

          {/* Link Previews (for each URL found) */}
          {previews.map((preview, index) => (
            <LinkPreview key={index} preview={preview} />
          ))}
        </View>
      </TouchableWithoutFeedback>
      <ActionBar
        commentsCount={comments.length}
        isLiked={isLiked}
        isSaved={isSaved}
        likes={likes}
        onCommentPress={onCommentPress}
        onLike={onLike}
        onSave={onSave}
        onShare={onShare}
        sharesCount={echo}
      />{' '}
      {/* Custom action bar for like, share, etc. */}
    </View>
  );
};

export default memo(
  TextPostComponent,
  (prevProps, nextProps) => prevProps.post.id === nextProps.post.id,
);
