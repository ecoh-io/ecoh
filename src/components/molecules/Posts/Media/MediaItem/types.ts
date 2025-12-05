import { Media } from '@/src/shared/types/Media';

export interface MediaItemProps {
  item: Media;
  isAutoplay?: boolean;
  onVideoRefReady?: (videoRef: any) => void;
}
