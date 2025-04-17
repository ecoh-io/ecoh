import React, { useMemo, memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeContext';
import { formatNumber } from '@/src/lib/helpers';
import { styles } from './styles';
import { ActionWithCountProps, ActionBarProps } from './types';
import { LikeButton, SaveButton } from '../../Animations';

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
  (prev, next) =>
    prev.count === next.count &&
    prev.accessibilityLabel === next.accessibilityLabel,
);

const ActionBar: React.FC<ActionBarProps> = ({
  likes = 0,
  commentsCount = 0,
  echoCount = 0,
  isLiked,
  isSaved,
  onLike,
  onCommentPress,
  onShare,
  onSave,
}) => {
  const { colors } = useTheme();
  const subtleLikedColor = 'rgba(255, 0, 0, 0.15)';
  const subtleSavedColor = 'rgba(0, 122, 255, 0.15)';

  const formattedLikes = useMemo(() => formatNumber(likes), [likes]);
  const formattedComments = useMemo(
    () => formatNumber(commentsCount),
    [commentsCount],
  );
  const formattedShares = useMemo(() => formatNumber(echoCount), [echoCount]);

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <View style={styles.actionButtonRow}>
          <View
            style={[
              styles.actionWithCount,
              {
                borderColor: isLiked ? subtleLikedColor : colors.secondary,
                backgroundColor: isLiked ? subtleLikedColor : 'transparent',
              },
            ]}
          >
            <LikeButton isLiked={isLiked} onLike={onLike} />
            <Text style={[styles.countText, { color: colors.text }]}>
              {formattedLikes}
            </Text>
          </View>

          <ActionWithCount
            onPress={onCommentPress}
            icon={<Feather name="message-circle" size={18} color="#000" />}
            count={commentsCount}
            accessibilityLabel={`Comment. ${formattedComments} ${
              commentsCount === 1 ? 'comment' : 'comments'
            }`}
            colors={colors}
          />

          <ActionWithCount
            onPress={onShare}
            icon={<Feather name="send" size={18} color="#000" />}
            count={echoCount}
            accessibilityLabel={`Share. ${formattedShares} ${
              echoCount === 1 ? 'share' : 'shares'
            }`}
            colors={colors}
          />
        </View>

        <View
          style={[
            styles.saveButton,
            {
              borderColor: isSaved ? subtleSavedColor : colors.secondary,
              backgroundColor: isSaved ? subtleSavedColor : 'transparent',
            },
          ]}
        >
          <SaveButton isSaved={isSaved} onSave={onSave} />
        </View>
      </View>
    </View>
  );
};

export default memo(
  ActionBar,
  (prev, next) =>
    prev.likes === next.likes &&
    prev.commentsCount === next.commentsCount &&
    prev.echoCount === next.echoCount &&
    prev.isLiked === next.isLiked &&
    prev.isSaved === next.isSaved,
);
