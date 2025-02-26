// src/components/Posts/Video/VideoPost.tsx
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import AnimatedHeart from '../Animated/AnimatedHeart';
import { VideoPost } from '@/src/types/post';

export interface VideoPostComponentProps {
  post: VideoPost;
  onDoubleTap?: () => void;
  isAutoplay?: boolean;
}

export interface VideoPostHandle {
  playAsync: () => void;
  pauseAsync: () => void;
}

const VideoPostComponent = forwardRef<VideoPostHandle, VideoPostComponentProps>(
  ({ post, onDoubleTap, isAutoplay }, ref) => {
    // Although we keep a local ref for the container, we expose the player instance.
    const videoContainerRef = useRef<View>(null);
    // Create a video player instance from expo-video.
    const player = useVideoPlayer(post.videoUri, (instance) => {
      instance.loop = true;
      instance.muted = true; // Start muted by default.
    });

    // Expose playAsync and pauseAsync methods to parent via ref.
    useImperativeHandle(ref, () => ({
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
    }));

    // Autoplay/pause based on isAutoplay prop.
    useEffect(() => {
      if (isAutoplay) {
        try {
          player.play();
        } catch (error) {
          console.error('Error starting video playback:', error);
        }
      } else {
        try {
          player.pause();
        } catch (error) {
          console.error('Error pausing video playback:', error);
        }
      }
    }, [isAutoplay, player]);

    return (
      <View ref={videoContainerRef} style={styles.wrapper}>
        <View style={styles.container}>
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            contentFit="cover"
            onFullscreenEnter={() => console.log('fullscreen')}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginVertical: 16,
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

export default VideoPostComponent;
