// src/components/MediaPost/MediaCarousel.tsx
import React, { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import MediaItem from './MediaItem';
import { Media } from '@/src/types/Media';

interface MediaCarouselProps {
  data: Media[];
  itemWidth: number;
  itemHeight: number;
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  onVideoRefReady?: (videoRef: any) => void;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({
  data,
  itemWidth,
  itemHeight,
  currentIndex,
  setCurrentIndex,
  onVideoRefReady,
}) => {
  if (data.length === 0) return null;

  return (
    <View>
      <Carousel
        width={itemWidth}
        height={itemHeight}
        data={data}
        snapEnabled
        pagingEnabled
        scrollAnimationDuration={300}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item, index }) => (
          <MediaItem
            item={item}
            isAutoplay={index === currentIndex} // or false if you only autoplay the current one
            onVideoRefReady={onVideoRefReady}
          />
        )}
        loop={false}
        style={{
          width: itemWidth,
          height: itemHeight,
        }}
      />
    </View>
  );
};

export default MediaCarousel;
