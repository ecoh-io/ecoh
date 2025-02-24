import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import AnimatedHeart from '../Animated/AnimatedHeart';
import { VideoPost } from '@/src/types/post';

interface VideoPostProps {
  post: VideoPost;
  onDoubleTap?: () => void;
  isAutoplay?: boolean;
}

const VideoPostComponent: React.FC<VideoPostProps> = ({
  post,
  onDoubleTap,
  isAutoplay,
}) => {
  const [showHeart, setShowHeart] = useState(false);
  const videoRef = useRef<View>(null);
  const player = useVideoPlayer(post.videoUri, (instance) => {
    instance.loop = true;
    instance.muted = true; // Start muted by default
  });

  useEffect(() => {
    // Autoplay video when visible
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

  const handleDoubleTap = useCallback(() => {
    if (onDoubleTap) {
      onDoubleTap();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800); // Hide heart after animation
    }
  }, [onDoubleTap]);

  return (
    <View ref={videoRef} style={styles.wrapper}>
      <GestureDetector
        gesture={Gesture.Exclusive(
          Gesture.Tap().numberOfTaps(2).onEnd(handleDoubleTap),
        )}
      >
        <View style={styles.container}>
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            contentFit="cover"
            onFullscreenEnter={() => console.log('fullscreen')}
          />

          {/* Animated Heart on Double Tap */}
          {showHeart && (
            <AnimatedHeart
              onAnimationComplete={handleDoubleTap}
              visible={showHeart}
            />
          )}
        </View>
      </GestureDetector>
    </View>
  );
};

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
