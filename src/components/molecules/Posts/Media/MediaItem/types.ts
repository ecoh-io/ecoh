import { Media } from '@/src/types/Media';

export interface MediaItemProps {
  item: Media;
  isAutoplay?: boolean;
  onVideoRefReady?: (videoRef: any) => void;
}
