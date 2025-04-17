import { Colors } from '@/src/types/color';

export interface ActionBarProps {
  likes: number;
  commentsCount: number;
  echoCount?: number;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onCommentPress: () => void;
  onShare: () => void;
  onSave: () => void;
}

export interface ActionWithCountProps {
  onPress: () => void;
  icon: React.ReactNode;
  count: number;
  accessibilityLabel: string;
  colors: Colors;
}
