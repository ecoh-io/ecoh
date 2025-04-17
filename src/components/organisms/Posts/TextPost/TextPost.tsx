import { useTheme } from '@/src/theme/ThemeContext';
import { useLinkPreviews } from '@/src/hooks/useLinkPreviews';
import { extractUrls } from '@/src/utils/urlHelpers';
import { styles } from './styles';
import { TextPostProps } from './types';
import LinkPreview from '@/src/components/molecules/Posts/LinkPreview/LinkPreview';
import ParsedTextContent from '@/src/components/molecules/Posts/ParsedTextContent/ParsedTextContent';
import {
  AccessibilityActionEvent,
  LayoutAnimation,
  Platform,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native';
import { memo, useCallback, useMemo, useState } from 'react';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TextPostComponent: React.FC<TextPostProps> = ({
  post,
  onHashtagPress,
  onMentionPress,
  onLinkPress,
  renderActionBar,
}) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const urls = useMemo(() => extractUrls(post.content), [post.content]);
  const { previews } = useLinkPreviews(urls);

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
          <ParsedTextContent
            text={post.content}
            isExpanded={isExpanded}
            onHashtagPress={onHashtagPress}
            onMentionPress={onMentionPress}
            onLinkPress={onLinkPress}
            color={colors.text}
          />
          {previews.map((preview, index) => (
            <LinkPreview key={index} preview={preview} />
          ))}
        </View>
      </TouchableWithoutFeedback>

      {renderActionBar && renderActionBar()}
    </View>
  );
};

export default memo(
  TextPostComponent,
  (prev, next) =>
    prev.isLiked === next.isLiked &&
    prev.post.id === next.post.id &&
    prev.isSaved === next.isSaved,
);
