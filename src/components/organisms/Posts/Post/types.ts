import { LayoutChangeEvent } from 'react-native';
import { PostData } from '@/src/types/post';
import { VideoRefHandle } from '@/src/hoc/withFeedManger';

export interface PostProps {
  post: PostData;
  isAutoplay?: boolean;
  registerVideoRef?: (id: string, ref: VideoRefHandle | null) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}
