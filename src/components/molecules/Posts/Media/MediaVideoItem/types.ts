import { VideoRefHandle } from '@/src/features/feed/hoc/withFeedManger';

export interface MediaVideoItemProps {
  uri: string;
  isAutoplay?: boolean;
  onVideoRefReady?: (videoRef: VideoRefHandle | null) => void;
}
