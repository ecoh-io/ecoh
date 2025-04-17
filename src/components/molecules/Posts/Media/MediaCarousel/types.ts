import { Dispatch, SetStateAction } from 'react';
import { Media } from '@/src/types/Media';

export interface MediaCarouselProps {
  data: Media[];
  itemWidth: number;
  itemHeight: number;
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  onVideoRefReady?: (videoRef: any) => void;
}
