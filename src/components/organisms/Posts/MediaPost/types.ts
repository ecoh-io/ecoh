import { MediaPost } from '@/src/types/post';
import { ActionBarProps } from '@/src/components/molecules/Posts/ActionBar';
import { VideoRefHandle } from '@/src/hoc/withFeedManger';

export interface MediaPostProps
  extends Omit<ActionBarProps, 'likes' | 'commentsCount' | 'echoCount'> {
  post: MediaPost;
  onVideoRefReady: (videoRef: VideoRefHandle | null) => void;
  onHashtagPress?: (hashtag: string) => void;
  onMentionPress?: (mention: string) => void;
  onLinkPress?: (url: string) => void;
  renderActionBar?: () => React.ReactNode;
}
