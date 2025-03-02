// src/components/TextPost/ParsedTextContent.tsx
import React, { useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { truncateUrl } from '@/src/utils/urlHelpers';
import { SecureUrlText } from './SecureUrlText';
import { styles } from './styles';

interface ParsedTextContentProps {
  text: string;
  isExpanded: boolean;
  onHashtagPress?: (hashtag: string) => void;
  onMentionPress?: (mention: string) => void;
  onLinkPress?: (url: string) => void;
  color?: string; // color for normal text
}

// If you want to define a max lines for collapsed text
const MAX_LINES = 7;

const ParsedTextContent: React.FC<ParsedTextContentProps> = ({
  text,
  isExpanded,
  onHashtagPress,
  onMentionPress,
  onLinkPress,
  color = '#000',
}) => {
  // Handlers for different pattern presses
  const handleHashtagPress = useCallback(
    (hashtag: string) => {
      onHashtagPress
        ? onHashtagPress(hashtag)
        : Alert.alert('Hashtag Pressed', hashtag);
    },
    [onHashtagPress],
  );

  const handleMentionPress = useCallback(
    (mention: string) => {
      onMentionPress
        ? onMentionPress(mention)
        : Alert.alert('Mention Pressed', mention);
    },
    [onMentionPress],
  );

  const handleUrlPress = useCallback(
    (truncatedUrl: string) => {
      // You might store the "original" URL in the truncated text if you do so in parse
      // For simplicity, treat truncatedUrl as the final
      onLinkPress
        ? onLinkPress(truncatedUrl)
        : Alert.alert('Open URL', truncatedUrl);
    },
    [onLinkPress],
  );

  /**
   * The core <ParsedText> element.
   *
   * - Replace **bold** text, _italic_, etc.
   * - Wrap URLs in a custom element that includes a lock icon if HTTPS.
   * - Limit lines when not expanded.
   */
  const parsedElement = useMemo(() => {
    return (
      <ParsedText
        style={[styles.textContent, { color }]}
        numberOfLines={isExpanded ? undefined : MAX_LINES}
        ellipsizeMode="tail"
        parse={[
          {
            type: 'url',
            style: styles.urlText,
            onPress: handleUrlPress,
            renderText: (matchingString: string) => {
              const { truncated, isSecure } = truncateUrl(matchingString);
              return <SecureUrlText url={truncated} isSecure={isSecure} />;
            },
          },
          {
            pattern: /#(\w+)/,
            style: styles.hashtagText,
            onPress: handleHashtagPress,
          },
          {
            pattern: /@(\w+)/,
            style: styles.mentionText,
            onPress: handleMentionPress,
          },
          {
            pattern: /\*\*(.*?)\*\*/,
            style: styles.boldText,
            renderText: (_matchingString, matches) => matches[1],
          },
          {
            pattern: /__(.*?)__/,
            style: styles.boldText,
            renderText: (_matchingString, matches) => matches[1],
          },
          {
            pattern: /\*(.*?)\*/,
            style: styles.italicText,
            renderText: (_matchingString, matches) => matches[1],
          },
          {
            pattern: /_(.*?)_/,
            style: styles.italicText,
            renderText: (_matchingString, matches) => matches[1],
          },
          {
            pattern: /~~(.*?)~~/,
            style: styles.strikethroughText,
            renderText: (_matchingString, matches) => matches[1],
          },
        ]}
        childrenProps={{ allowFontScaling: false }}
      >
        {text}
      </ParsedText>
    );
  }, [
    text,
    color,
    isExpanded,
    handleUrlPress,
    handleHashtagPress,
    handleMentionPress,
  ]);

  return parsedElement;
};

export default ParsedTextContent;
