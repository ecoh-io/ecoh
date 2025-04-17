import React from 'react';
import { View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import MediaItem from '../MediaItem'; // relative import within media folder
import { MediaCarouselProps } from './types';

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
            isAutoplay={index === currentIndex}
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
