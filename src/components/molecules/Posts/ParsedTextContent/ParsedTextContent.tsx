import React, { useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { truncateUrl } from '@/src/utils/urlHelpers';
import { styles } from './styles';
import { ParsedTextContentProps } from './types';
import { SecureUrlText } from '@/src/components/atoms';

const MAX_LINES = 7;

const ParsedTextContent: React.FC<ParsedTextContentProps> = ({
  text,
  isExpanded,
  onHashtagPress,
  onMentionPress,
  onLinkPress,
  color = '#000',
}) => {
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
      onLinkPress
        ? onLinkPress(truncatedUrl)
        : Alert.alert('Open URL', truncatedUrl);
    },
    [onLinkPress],
  );

  const parsedElement = useMemo(
    () => (
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
            renderText: (_match, matches) => matches[1],
          },
          {
            pattern: /__(.*?)__/,
            style: styles.boldText,
            renderText: (_match, matches) => matches[1],
          },
          {
            pattern: /\*(.*?)\*/,
            style: styles.italicText,
            renderText: (_match, matches) => matches[1],
          },
          {
            pattern: /_(.*?)_/,
            style: styles.italicText,
            renderText: (_match, matches) => matches[1],
          },
          {
            pattern: /~~(.*?)~~/,
            style: styles.strikethroughText,
            renderText: (_match, matches) => matches[1],
          },
        ]}
        childrenProps={{ allowFontScaling: false }}
      >
        {text}
      </ParsedText>
    ),
    [
      text,
      color,
      isExpanded,
      handleUrlPress,
      handleHashtagPress,
      handleMentionPress,
    ],
  );

  return parsedElement;
};

export default ParsedTextContent;
