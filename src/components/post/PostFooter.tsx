import React, { useMemo, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedLikeButton from './Animated/AnimatedLikeButton';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import AnimatedSaveButton from './Animated/AnimatedSaveButton';
import { formatNumber } from '@/src/lib/helpers';

interface PostFooterProps {
  likes: number;
  commentsCount: number;
  sharesCount?: number;
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
  likes = 0,
  commentsCount = 0,
  sharesCount = 0, // Default to 0 if not provided
  isLiked,
  isSaved,
  onLike,
  onCommentPress,
  onShare,
  onSave,
}) => {
  const { colors } = useTheme();

  // Memoize formatted counts
  const formattedLikes = useMemo(
    () => formatNumber(likes),
    [likes, formatNumber],
  );
  const formattedComments = useMemo(
    () => formatNumber(commentsCount),
    [commentsCount, formatNumber],
  );
  const formattedShares = useMemo(
    () => formatNumber(sharesCount),
    [sharesCount, formatNumber],
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
          accessibilityLabel={`Comment. ${formattedComments} ${
            commentsCount === 1 ? 'comment' : 'comments'
          }`}
        />

        {/* Share Button with Count */}
        <ActionWithCount
          onPress={onShare}
          icon={<Feather name="send" size={24} color="#000" />}
          count={sharesCount}
          accessibilityLabel={`Share. ${formattedShares} ${
            sharesCount === 1 ? 'share' : 'shares'
          }`}
        />

        {/* Save Button */}
        <View style={styles.saveButton}>
          <AnimatedSaveButton isSaved={isSaved} onSave={onSave} />
        </View>
      </View>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 18,
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
    fontFamily: typography.Poppins.medium,
    color: '#000', // Default color, overridden by dynamic color if needed
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
