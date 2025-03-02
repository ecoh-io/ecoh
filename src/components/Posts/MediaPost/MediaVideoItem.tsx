// src/components/MediaPost/MediaVideoItem.tsx
import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { VideoRefHandle } from '../../Feed/withFeedManager';

interface MediaVideoItemProps {
  uri: string;
  isAutoplay?: boolean;
  onVideoRefReady?: (videoRef: VideoRefHandle | null) => void;
}

const MediaVideoItem = forwardRef<VideoRefHandle, MediaVideoItemProps>(
  ({ uri, isAutoplay = true, onVideoRefReady }, ref) => {
    const videoContainerRef = useRef<View>(null);
    // create a player instance
    const player = useVideoPlayer(uri, (instance) => {
      instance.loop = true;
      instance.muted = true; // start muted
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
      current: async () => {
        return player.currentTime;
      },
    };

    useImperativeHandle(ref, () => videoRef, [player]);

    useEffect(() => {
      if (onVideoRefReady) {
        onVideoRefReady(videoRef);

        // Autoplay if isAutoplay is true
        if (isAutoplay) {
          videoRef.playAsync();
        }
      }

      // Cleanup: pass null if unmounting
      return () => {
        if (onVideoRefReady) {
          onVideoRefReady(null);
        }
      };
    }, [onVideoRefReady, player, isAutoplay, videoRef]);

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

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
});
