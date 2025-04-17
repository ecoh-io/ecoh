import { VideoRefHandle } from '@/src/hoc/withFeedManger';

export interface MediaVideoItemProps {
  uri: string;
  isAutoplay?: boolean;
  onVideoRefReady?: (videoRef: VideoRefHandle | null) => void;
}
