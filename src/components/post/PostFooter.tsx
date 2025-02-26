import React, { useMemo, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedLikeButton from './Animated/AnimatedLikeButton';
import { useTheme } from '@/src/theme/ThemeContext';
import { typography } from '@/src/theme/typography';
import AnimatedSaveButton from './Animated/AnimatedSaveButton';
import { formatNumber } from '@/src/lib/helpers';
import { Colors } from '@/src/types/color';

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
  colors: Colors;
}

const ActionWithCount: React.FC<ActionWithCountProps> = memo(
  ({ onPress, icon, count, accessibilityLabel, colors }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionWithCount, { borderColor: colors.secondary }]}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      {icon}
      <Text style={[styles.countText, { color: colors.text }]}>{count}</Text>
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

  const subtleLikedColor = 'rgba(255, 0, 0, 0.15)';

  const subtleSavedColor = 'rgba(0, 122, 255, 0.15)'; // Subtle blue color

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
        <View style={styles.actionButtonRow}>
          {/* Like Button with Count */}
          <View
            style={[
              styles.actionWithCount,
              {
                borderColor: isLiked ? subtleLikedColor : colors.secondary,
                backgroundColor: isLiked ? subtleLikedColor : 'transparent',
              },
            ]}
          >
            <AnimatedLikeButton isLiked={isLiked} onLike={onLike} />
            <Text style={[styles.countText, { color: colors.text }]}>
              {formattedLikes}
            </Text>
          </View>

          {/* Comment Button with Count */}
          <ActionWithCount
            onPress={onCommentPress}
            icon={<Feather name="message-circle" size={18} color="#000" />}
            count={commentsCount}
            accessibilityLabel={`Comment. ${formattedComments} ${
              commentsCount === 1 ? 'comment' : 'comments'
            }`}
            colors={colors}
          />

          {/* Share Button with Count */}
          <ActionWithCount
            onPress={onShare}
            icon={<Feather name="send" size={18} color="#000" />}
            count={sharesCount}
            accessibilityLabel={`Share. ${formattedShares} ${
              sharesCount === 1 ? 'share' : 'shares'
            }`}
            colors={colors}
          />
        </View>
        {/* Save Button */}
        <View
          style={[
            styles.saveButton,
            {
              borderColor: isSaved ? subtleSavedColor : colors.secondary,
              backgroundColor: isSaved ? subtleSavedColor : 'transparent',
            },
          ]}
        >
          <AnimatedSaveButton isSaved={isSaved} onSave={onSave} />
        </View>
      </View>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionWithCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 32,
    borderWidth: 1,
  },
  saveButton: {
    justifyContent: 'center',
    padding: 6,
    borderRadius: 32,
    borderWidth: 1,
  },
  countText: {
    marginLeft: 6,
    fontSize: typography.fontSizes.button,
    fontFamily: typography.fontFamilies.poppins.medium,
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
