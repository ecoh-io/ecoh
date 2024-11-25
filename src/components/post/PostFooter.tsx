import React, { useMemo, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import AnimatedLikeButton from './AnimatedLikeButton';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

interface PostFooterProps {
  likes: number;
  commentsCount: number;
  sharesCount?: number; // Made optional
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onCommentPress: () => void;
  onShare: () => void;
  onSave: () => void;
}

// Memoized sub-component for action buttons with count
interface ActionWithCountProps {
  onPress: () => void;
  icon: React.ReactNode;
  count: number;
  accessibilityLabel: string;
}

const ActionWithCount: React.FC<ActionWithCountProps> = memo(
  ({ onPress, icon, count, accessibilityLabel }) => (
    <TouchableOpacity
      onPress={onPress}
      style={styles.actionWithCount}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      {icon}
      <Text style={styles.countText}>{count}</Text>
    </TouchableOpacity>
  ),
  (prevProps, nextProps) =>
    prevProps.count === nextProps.count &&
    prevProps.accessibilityLabel === nextProps.accessibilityLabel,
);

const PostFooter: React.FC<PostFooterProps> = ({
  likes,
  commentsCount,
  sharesCount = 0, // Default to 0 if not provided
  isLiked,
  isSaved,
  onLike,
  onCommentPress,
  onShare,
  onSave,
}) => {
  const { colors } = useTheme();

  // Memoize the formatCount function to avoid recreating it on every render
  const formatCount = useMemo(
    () => (count: number) => {
      if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
      }
      return count.toString();
    },
    [],
  );

  // Memoize formatted counts
  const formattedLikes = useMemo(
    () => formatCount(likes),
    [likes, formatCount],
  );
  const formattedComments = useMemo(
    () => formatCount(commentsCount),
    [commentsCount, formatCount],
  );
  const formattedShares = useMemo(
    () => formatCount(sharesCount),
    [sharesCount, formatCount],
  );

  return (
    <View style={styles.container}>
      {/* Actions Row */}
      <View style={styles.actionsRow}>
        {/* Like Button with Count */}
        <View style={styles.actionWithCount}>
          <AnimatedLikeButton isLiked={isLiked} onLike={onLike} />
          <Text style={[styles.countText, { color: colors.text }]}>
            {formattedLikes}
          </Text>
        </View>

        {/* Comment Button with Count */}
        <ActionWithCount
          onPress={onCommentPress}
          icon={<Feather name="message-circle" size={24} color="#000" />}
          count={commentsCount}
          accessibilityLabel={`Comment. ${commentsCount} ${
            commentsCount === 1 ? 'comment' : 'comments'
          }`}
        />

        {/* Share Button with Count */}
        <ActionWithCount
          onPress={onShare}
          icon={<Feather name="send" size={24} color="#000" />}
          count={sharesCount}
          accessibilityLabel={`Share. ${sharesCount} ${
            sharesCount === 1 ? 'share' : 'shares'
          }`}
        />

        {/* Save Button */}
        <TouchableOpacity
          onPress={onSave}
          style={styles.saveButton}
          activeOpacity={0.7}
          accessibilityLabel={isSaved ? 'Unsave post' : 'Save post'}
          accessibilityRole="button"
        >
          {isSaved ? (
            <MaskedView
              maskElement={
                <FontAwesome name="bookmark" size={24} color="#000" />
              }
            >
              <LinearGradient
                colors={['#00c6ff', '#0072ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientIconBackground}
              />
            </MaskedView>
          ) : (
            <FontAwesome name="bookmark-o" size={24} color="#828282" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: '#fff', // Ensure background color for consistency
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionWithCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  saveButton: {
    marginLeft: 'auto',
  },
  countText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: typography.Poppins.regular,
    color: '#000', // Default color, overridden by dynamic color if needed
  },
  gradientIconBackground: {
    width: 24,
    height: 24,
  },
});

export default memo(
  PostFooter,
  (prevProps, nextProps) =>
    prevProps.likes === nextProps.likes &&
    prevProps.commentsCount === nextProps.commentsCount &&
    prevProps.sharesCount === nextProps.sharesCount &&
    prevProps.isLiked === nextProps.isLiked &&
    prevProps.isSaved === nextProps.isSaved,
);
