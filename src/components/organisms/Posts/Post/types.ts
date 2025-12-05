import { LayoutChangeEvent } from 'react-native';
import { PostData } from '@/src/shared/types/post';
import { VideoRefHandle } from '@/src/features/feed/hoc/withFeedManger';

export interface PostProps {
  post: PostData;
  isAutoplay?: boolean;
  registerVideoRef?: (id: string, ref: VideoRefHandle | null) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}
