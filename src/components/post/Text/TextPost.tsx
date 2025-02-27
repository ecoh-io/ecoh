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

import { TextPost } from '@/src/types/post';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import ParsedText from 'react-native-parsed-text';
import { extractUrls } from '@/src/utils/extractUrls'; // Utility to extract URLs
import { useLinkPreviews } from '@/src/hooks/useLinkPreviews'; // Custom hook to fetch metadata
import LinkPreviewComponent from '../LinkPreviewComponent'; // Component to render previews
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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
}

const SecureUrlText: React.FC<{ url: string; isSecure: boolean }> = ({
  url,
  isSecure,
}) => {
  return (
    <Text style={styles.urlText}>
      <Ionicons
        name={isSecure ? 'lock-closed' : 'lock-open'}
        size={16}
        color={isSecure ? '#8BC34A' : '#FF9800'}
      />{' '}
      {url}
    </Text>
  );
};

const TextPostComponent: React.FC<TextPostProps> = ({
  post,
  onDoubleTap,
  onLike,
  onHashtagPress,
  onMentionPress,
  onLinkPress,
  onReact,
}) => {
  const [showHeart, setShowHeart] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { colors } = useTheme();

  // Extract unique URLs from post content
  const urls = useMemo(() => extractUrls(post.content), [post.content]);

  // Fetch metadata for extracted URLs
  const { previews, loading, error } = useLinkPreviews(urls);

  // Maximum number of lines before truncation
  const MAX_LINES = 7;

  // Handler for double-tap gesture (Like)
  const handleDoubleTap = useCallback(() => {
    onDoubleTap();
    if (onLike) {
      onLike();
    }
    setShowHeart(true);
  }, [onDoubleTap, onLike]);

  // Toggle expanded state with animation
  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  }, []);

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

  const truncateUrl = (
    url: string,
    maxLength: number = 45,
  ): { truncated: string; original: string; isSecure: boolean } => {
    const original = url;

    const isSecure = original.startsWith('https://');

    // Remove protocol (http:// or https://)
    url = url.replace(/^(https?:\/\/)/, '');

    // Remove www.
    url = url.replace(/^www\./, '');

    if (url.length <= maxLength) return { truncated: url, original, isSecure };

    // Truncate the remaining part
    const truncated = url.slice(0, maxLength - 5) + '...';

    return { truncated, original, isSecure };
  };

  const urlMap = useMemo(() => {
    return urls.reduce((acc, url) => {
      const { truncated, original, isSecure } = truncateUrl(url);
      acc[truncated] = { original, isSecure };
      return acc;
    }, {} as Record<string, { original: string; isSecure: boolean }>);
  }, [urls]);

  const handleUrlPressInternal = useCallback(
    (truncatedUrl: string) => {
      const { original } = urlMap[truncatedUrl] || { original: truncatedUrl };
      onLinkPress
        ? onLinkPress(original)
        : Linking.openURL(original).catch((err) =>
            console.error("Couldn't load page", err),
          );
    },
    [onLinkPress, urlMap],
  );

  // Function to render the parsed text with styles and actions
  const renderParsedText = useMemo(() => {
    return (
      <ParsedText
        style={[styles.textContent, { color: colors.text }]}
        numberOfLines={isExpanded ? undefined : MAX_LINES}
        ellipsizeMode="tail"
        parse={[
          {
            type: 'url',
            style: styles.urlText,
            onPress: handleUrlPressInternal,
            renderText: (matchingString: string) => {
              const { truncated, isSecure } = truncateUrl(matchingString);
              return <SecureUrlText url={truncated} isSecure={isSecure} />;
            },
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
          {
            pattern: /\*\*(.*?)\*\*/,
            renderText: (matchingString, matches) => {
              return matches[1];
            },
            style: styles.boldText,
          },
          {
            pattern: /__(.*?)__/,
            renderText: (matchingString, matches) => {
              return matches[1];
            },
            style: styles.boldText,
          },
          {
            pattern: /\*(.*?)\*/,
            renderText: (matchingString, matches) => {
              return matches[1];
            },
            style: styles.italicText,
          },
          {
            pattern: /_(.*?)_/,
            renderText: (matchingString, matches) => {
              return matches[1];
            },
            style: styles.italicText,
          },
          {
            pattern: /~~(.*?)~~/,
            renderText: (matchingString, matches) => {
              return matches[1];
            },
            style: styles.strikethroughText,
          },
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
  ]);

  return (
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
        <View style={styles.textContainer}>{renderParsedText}</View>

        {/* Render URL Previews */}

        {previews.map((preview, index) => (
          <LinkPreviewComponent key={index} preview={preview} />
        ))}
      </View>
    </TouchableWithoutFeedback>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 14,
    position: 'relative', // Ensure heart can be positioned absolutely if needed
    paddingLeft: 25,
  },
  textContent: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: typography.fontFamilies.poppins.regular,
  },
  boldText: {
    fontFamily: typography.fontFamilies.poppins.bold,
  },
  italicText: {
    fontFamily: typography.fontFamilies.poppins.italic,
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
    color: '#3498db', // Example color for mentions
  },
  secureUrlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    display: 'flex',
  },
  urlText: {
    color: '#4e8cff',
    fontSize: 16,
    lineHeight: 21,
    fontFamily: typography.fontFamilies.poppins.medium,
    textDecorationLine: 'underline',
    textDecorationColor: '#4e8cff',
  },
  readMoreContainer: {
    marginTop: 4,
  },
  textContainer: {
    position: 'relative',
  },
});

export default memo(
  TextPostComponent,
  (prevProps, nextProps) => prevProps.post.id === nextProps.post.id,
);
