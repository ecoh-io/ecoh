import { ActionBarProps } from '@/src/components/molecules/Posts/ActionBar';
import { TextPost } from '@/src/types/post';

export interface TextPostProps
  extends Omit<ActionBarProps, 'likes' | 'commentsCount' | 'echoCount'> {
  post: TextPost;
  onDoubleTap?: () => void;
  onHashtagPress?: (hashtag: string) => void;
  onMentionPress?: (mention: string) => void;
  onLinkPress?: (url: string) => void;
  renderActionBar?: () => React.ReactNode;
}
