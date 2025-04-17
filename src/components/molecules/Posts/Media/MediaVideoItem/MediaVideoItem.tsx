import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { styles } from './styles';
import { MediaVideoItemProps } from './types';
import { VideoRefHandle } from '@/src/hoc/withFeedManger';

const MediaVideoItem = forwardRef<VideoRefHandle, MediaVideoItemProps>(
  ({ uri, isAutoplay = true, onVideoRefReady }, ref) => {
    const videoContainerRef = useRef<View>(null);
    const player = useVideoPlayer(uri, (instance) => {
      instance.loop = true;
      instance.muted = true;
    });

    const videoRef: VideoRefHandle = {
      playAsync: () => {
        try {
          player.play();
        } catch (error) {
          console.error('Error playing video:', error);
        }
      },
      pauseAsync: () => {
        try {
          player.pause();
        } catch (error) {
          console.error('Error pausing video:', error);
        }
      },
      current: async () => player.currentTime,
    };

    useImperativeHandle(ref, () => videoRef, [player]);

    useEffect(() => {
      if (onVideoRefReady) {
        onVideoRefReady(videoRef);
        if (isAutoplay) {
          videoRef.playAsync();
        }
      }

      return () => {
        if (onVideoRefReady) {
          onVideoRefReady(null);
        }
      };
    }, [onVideoRefReady, player, isAutoplay]);

    return (
      <View ref={videoContainerRef} style={styles.wrapper}>
        <View style={styles.container}>
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            contentFit="cover"
          />
        </View>
      </View>
    );
  },
);

export default MediaVideoItem;
