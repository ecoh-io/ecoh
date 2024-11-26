import React, { useState, useCallback, memo, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
  Alert,
  AccessibilityActionEvent,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import AnimatedHeart from '../Animated/AnimatedHeart';
import { TextPost } from '@/src/types/post';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import ParsedText from 'react-native-parsed-text';
import { extractUrls } from '@/src/utils/extractUrls'; // Utility to extract URLs
import { useLinkPreviews } from '@/src/hooks/useLinkPreviews'; // Custom hook to fetch metadata
import LinkPreviewComponent from '../LinkPreviewComponent'; // Component to render previews

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TextPostProps {
  post: TextPost;
  onDoubleTap: () => void;
  onLike?: () => void;
  onHashtagPress?: (hashtag: string) => void;
  onMentionPress?: (mention: string) => void;
  onLinkPress?: (url: string) => void;
  onReact?: (reaction: string) => void;
  readMoreText?: string;
  readLessText?: string;
}

const TextPostComponent: React.FC<TextPostProps> = ({
  post,
  onDoubleTap,
  onLike,
  onHashtagPress,
  onMentionPress,
  onLinkPress,
  onReact,
  readMoreText = 'Read more',
  readLessText = 'Read less',
}) => {
  const [showHeart, setShowHeart] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);
  const { colors } = useTheme();

  // Extract unique URLs from post content
  const urls = useMemo(() => extractUrls(post.content), [post.content]);

  // Fetch metadata for extracted URLs
  const { previews, loading, error } = useLinkPreviews(urls);

  // Maximum number of lines before truncation
  const MAX_LINES = 3;

  // Handler for double-tap gesture (Like)
  const handleDoubleTap = useCallback(() => {
    onDoubleTap();
    if (onLike) {
      onLike();
    }
    setShowHeart(true);
  }, [onDoubleTap, onLike]);

  // Handler to hide the heart after animation completes
  const handleAnimationComplete = useCallback(() => {
    setShowHeart(false);
  }, []);

  // Toggle expanded state with animation
  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  }, []);

  // Memoize the double-tap gesture to prevent re-creation on each render
  const doubleTapGesture = useMemo(
    () => Gesture.Tap().numberOfTaps(2).maxDelay(300).onEnd(handleDoubleTap),
    [handleDoubleTap],
  );

  // Accessibility handler for keyboard actions
  const handleAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      if (event.nativeEvent.actionName === 'activate') {
        toggleExpanded();
      }
    },
    [toggleExpanded],
  );

  // Handlers for different text patterns
  const handleHashtagPressInternal = useCallback(
    (hashtag: string) => {
      onHashtagPress
        ? onHashtagPress(hashtag)
        : Alert.alert('Hashtag Pressed', hashtag);
    },
    [onHashtagPress],
  );

  const handleMentionPressInternal = useCallback(
    (mention: string) => {
      onMentionPress
        ? onMentionPress(mention)
        : Alert.alert('Mention Pressed', mention);
    },
    [onMentionPress],
  );

  const handleUrlPressInternal = useCallback(
    (url: string) => {
      onLinkPress
        ? onLinkPress(url)
        : Linking.openURL(url).catch((err) =>
            console.error("Couldn't load page", err),
          );
    },
    [onLinkPress],
  );

  // Handler to determine if "Read More" should be shown
  const handleTextLayout = useCallback(
    (e: any) => {
      if (e.nativeEvent.lines.length > MAX_LINES && !isExpanded) {
        setShouldShowReadMore(true);
      } else {
        setShouldShowReadMore(false);
      }
    },
    [isExpanded],
  );

  // Function to render the parsed text with styles and actions
  const renderParsedText = useMemo(() => {
    return (
      <ParsedText
        style={[styles.textContent, { color: colors.text }]}
        numberOfLines={isExpanded ? undefined : MAX_LINES}
        ellipsizeMode="tail"
        onTextLayout={handleTextLayout}
        parse={[
          {
            type: 'url',
            style: styles.urlText,
            onPress: handleUrlPressInternal,
          },
          {
            pattern: /#(\w+)/,
            style: styles.hashtagText,
            onPress: handleHashtagPressInternal,
          },
          {
            pattern: /@(\w+)/,
            style: styles.mentionText,
            onPress: handleMentionPressInternal,
          },
          { pattern: /\*\*(.*?)\*\*/, style: styles.boldText },
          { pattern: /__(.*?)__/, style: styles.boldText },
          { pattern: /\*(.*?)\*/, style: styles.italicText },
          { pattern: /_(.*?)_/, style: styles.italicText },
          { pattern: /~~(.*?)~~/, style: styles.strikethroughText },
          { pattern: /`(.*?)`/, style: styles.codeText },
        ]}
        childrenProps={{ allowFontScaling: false }}
      >
        {post.content}
      </ParsedText>
    );
  }, [
    post.content,
    colors.text,
    isExpanded,
    handleHashtagPressInternal,
    handleMentionPressInternal,
    handleUrlPressInternal,
    handleTextLayout,
  ]);

  // Function to render "Read More"/"Read Less" link
  const renderReadMore = useMemo(() => {
    if (!shouldShowReadMore) {
      return null;
    }
    return (
      <TouchableOpacity
        onPress={toggleExpanded}
        style={styles.readMoreContainer}
        accessible
        accessibilityRole="button"
        accessibilityLabel={isExpanded ? 'Read less' : 'Read more'}
      >
        <Text style={[styles.readMoreText, { color: '#4e8cff' }]}>
          {isExpanded ? readLessText : readMoreText}
        </Text>
      </TouchableOpacity>
    );
  }, [
    shouldShowReadMore,
    isExpanded,
    toggleExpanded,
    readMoreText,
    readLessText,
  ]);

  return (
    <GestureDetector gesture={doubleTapGesture}>
      <TouchableWithoutFeedback
        onPress={toggleExpanded} // Enable tapping anywhere to expand/collapse
        accessibilityRole="button"
        accessibilityLabel={
          isExpanded
            ? 'Post content expanded. Double-tap to like.'
            : 'Post content. Double-tap to like. Tap to expand.'
        }
        accessibilityHint="Double-tap to like this post. Tap to expand or collapse the content."
        onAccessibilityAction={handleAccessibilityAction}
        accessibilityActions={[{ name: 'activate' }]}
      >
        <View style={[styles.container]}>
          {/* Parsed Text with Read More/Less */}
          <View>
            {renderParsedText}
            {renderReadMore}
          </View>

          {/* Render URL Previews */}
          {previews.map((preview, index) => (
            <LinkPreviewComponent key={index} preview={preview} />
          ))}

          {showHeart && (
            <AnimatedHeart
              visible={showHeart}
              onAnimationComplete={handleAnimationComplete}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </GestureDetector>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    position: 'relative', // Ensure heart can be positioned absolutely if needed
  },
  textContent: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: typography.Poppins.regular,
  },
  boldText: {
    fontWeight: '700', // Adjusted for better readability
  },
  italicText: {
    fontStyle: 'italic',
  },
  strikethroughText: {
    textDecorationLine: 'line-through',
  },
  codeText: {
    fontFamily: 'Courier',
    backgroundColor: '#f5f5f5',
    padding: 2,
    borderRadius: 4,
  },
  hashtagText: {
    color: '#1DA1F2', // Example color for hashtags
  },
  mentionText: {
    color: '#FF4500', // Example color for mentions
  },
  urlText: {
    color: '#4e8cff',
    textDecorationLine: 'underline',
  },
  readMoreContainer: {
    marginTop: 4,
  },
  readMoreText: {
    fontSize: 14,
    fontFamily: typography.Poppins.medium,
  },
});

export default memo(
  TextPostComponent,
  (prevProps, nextProps) => prevProps.post.id === nextProps.post.id,
);
