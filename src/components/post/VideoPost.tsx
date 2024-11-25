import React, {
  useEffect,
  useRef,
  useCallback,
  useReducer,
  useMemo,
  memo,
  useState,
} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
  Animated,
  Easing,
} from 'react-native';
import {
  Video,
  AVPlaybackStatus,
  VideoFullscreenUpdate,
  VideoFullscreenUpdateEvent,
} from 'expo-av';
import { VideoPost } from '@/src/types/post';
import { useTheme } from '@/src/theme/ThemeContext';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import AnimatedHeart from './AnimatedHeart';
import Slider from '@react-native-community/slider';

interface VideoPostProps {
  post: VideoPost;
  onDoubleTap?: () => void;
  isAutoplay?: boolean; // New prop to control autoplay
}

// Define action types for reducer
type Action =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'LOADING' }
  | { type: 'LOADED' }
  | { type: 'ERROR' }
  | { type: 'MUTE' }
  | { type: 'UNMUTE' }
  | { type: 'SHOW_CONTROLS' }
  | { type: 'HIDE_CONTROLS' }
  | { type: 'SET_FULLSCREEN'; payload: boolean }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_POSITION'; payload: number };

// Define state shape
interface State {
  isPlaying: boolean;
  isLoading: boolean;
  hasError: boolean;
  isMuted: boolean;
  showControls: boolean;
  isFullscreen: boolean;
  duration: number;
  position: number;
}

// Reducer function to manage state
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'LOADING':
      return { ...state, isLoading: true, hasError: false };
    case 'LOADED':
      return { ...state, isLoading: false };
    case 'ERROR':
      return { ...state, isLoading: false, hasError: true };
    case 'MUTE':
      return { ...state, isMuted: true };
    case 'UNMUTE':
      return { ...state, isMuted: false };
    case 'SHOW_CONTROLS':
      return { ...state, showControls: true };
    case 'HIDE_CONTROLS':
      return { ...state, showControls: false };
    case 'SET_FULLSCREEN':
      return { ...state, isFullscreen: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_POSITION':
      return { ...state, position: action.payload };
    default:
      return state;
  }
};

const VideoPostComponent: React.FC<VideoPostProps> = ({
  post,
  onDoubleTap,
  isAutoplay = false, // Default to false
}) => {
  const [showHeart, setShowHeart] = useState<boolean>(false);
  const { colors } = useTheme();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get('window');

  const videoRef = useRef<Video>(null);

  // Initialize reducer
  const [state, dispatch] = useReducer(reducer, {
    isPlaying: false,
    isLoading: true,
    hasError: false,
    isMuted: isAutoplay, // Mute if autoplaying
    showControls: false,
    isFullscreen: false,
    duration: 0,
    position: 0,
  });

  const {
    isPlaying,
    isLoading,
    hasError,
    isMuted,
    showControls,
    isFullscreen,
    duration,
    position,
  } = state;

  // Animated values
  const controlsOpacity = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;

  // Timer reference using useRef
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Gesture handling using react-native-gesture-handler
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      handleDoubleTap();
    });

  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      togglePlayback();
      dispatch({ type: 'SHOW_CONTROLS' });
      // Hide controls after delay
      hideControlsAfterDelay();
    });

  // Combine gestures
  const composedGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  // Handlers
  const togglePlayback = useCallback(async () => {
    if (videoRef.current) {
      try {
        const status = await videoRef.current.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await videoRef.current.pauseAsync();
            dispatch({ type: 'PAUSE' });
          } else {
            await videoRef.current.playAsync();
            dispatch({ type: 'PLAY' });
          }
        } else {
          console.warn('Video is not loaded yet.');
        }
      } catch (error) {
        console.error('Error toggling playback:', error);
        dispatch({ type: 'ERROR' });
      }
    }
  }, []);

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      dispatch({ type: 'LOADED' }); // Set isLoading to false

      dispatch({ type: status.isPlaying ? 'PLAY' : 'PAUSE' });

      if (status.durationMillis && status.positionMillis) {
        dispatch({ type: 'SET_DURATION', payload: status.durationMillis });
        dispatch({ type: 'SET_POSITION', payload: status.positionMillis });
      }

      if (status.isBuffering) {
      }

      if (status.didJustFinish && !status.isLooping) {
        dispatch({ type: 'PAUSE' });
        videoRef.current?.setPositionAsync(0);
      }
    } else if (status.error) {
      dispatch({ type: 'ERROR' });
    }
  }, []);

  const handleDoubleTap = useCallback(() => {
    if (onDoubleTap) {
      onDoubleTap();
      triggerHeartAnimation();
    }
  }, [onDoubleTap]);

  const triggerHeartAnimation = useCallback(() => {
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(heartScale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
    ]).start();
  }, [heartScale]);

  const toggleMute = useCallback(async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.setIsMutedAsync(!isMuted);
        dispatch({ type: isMuted ? 'UNMUTE' : 'MUTE' });
      } catch (error) {
        console.error('Error toggling mute:', error);
        dispatch({ type: 'ERROR' });
      }
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.presentFullscreenPlayer();
        dispatch({ type: 'SET_FULLSCREEN', payload: true });
      } catch (error) {
        console.error('Failed to enter fullscreen:', error);
      }
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    dispatch({ type: 'SET_FULLSCREEN', payload: false });
  }, []);

  // Show controls with fade-in animation
  useEffect(() => {
    Animated.timing(controlsOpacity, {
      toValue: showControls ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showControls, controlsOpacity]);

  // Hide controls after 3 seconds of inactivity
  const hideControlsAfterDelay = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current); // Clear any existing timer
    }
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'HIDE_CONTROLS' });
    }, 3000); // Hide controls after 3 seconds
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Automatically hide controls when entering fullscreen
  useEffect(() => {
    if (isFullscreen) {
      hideControlsAfterDelay();
    }
  }, [isFullscreen, hideControlsAfterDelay]);

  // Handle autoplay when isAutoplay prop changes
  useEffect(() => {
    if (isAutoplay) {
      // Automatically play the video muted
      if (videoRef.current) {
        videoRef.current.setIsMutedAsync(true);
        videoRef.current.playAsync();
        dispatch({ type: 'PLAY' });
      }
      dispatch({ type: 'MUTE' }); // Ensure video is muted
    } else {
      // Pause the video
      if (isPlaying) {
        togglePlayback();
      }
    }
  }, [isAutoplay, togglePlayback, isPlaying]);

  // Retry loading video on error
  const handleRetry = useCallback(async () => {
    if (videoRef.current) {
      try {
        dispatch({ type: 'LOADING' });
        await videoRef.current.unloadAsync(); // Unload the current video
        await videoRef.current.loadAsync(
          { uri: post.videoUri }, // Video source
          { shouldPlay: isAutoplay }, // Play automatically if autoplaying
        );
        dispatch({ type: 'LOADED' });
        if (isAutoplay) {
          dispatch({ type: 'MUTE' }); // Ensure video is muted when autoplaying
        }
      } catch (error) {
        dispatch({ type: 'ERROR' });
      }
    }
  }, [post.videoUri, isAutoplay]);

  // Format time in mm:ss
  const formatTime = useCallback((millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Memoized duration text
  const durationText = useMemo(
    () => formatTime(duration),
    [duration, formatTime],
  );

  // Memoized position text
  const positionText = useMemo(
    () => formatTime(position),
    [position, formatTime],
  );

  // Handle slider seek
  const handleSeek = useCallback(
    async (value: number) => {
      if (videoRef.current && duration) {
        try {
          const seekPosition = (value / 100) * duration;
          await videoRef.current.setPositionAsync(seekPosition);
          dispatch({ type: 'SET_POSITION', payload: seekPosition });
        } catch (error) {
          console.error('Error seeking video:', error);
          dispatch({ type: 'ERROR' });
        }
      }
    },
    [duration],
  );

  const handleAnimationComplete = useCallback(() => {
    setShowHeart(false);
  }, []);

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={composedGesture}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.touchable}
          accessibilityLabel="Video player. Double tap to like, single tap to play or pause."
          accessibilityRole="button"
        >
          <Video
            ref={videoRef}
            source={{ uri: post.videoUri }}
            style={[
              styles.video,
              {
                width: isFullscreen ? SCREEN_HEIGHT : SCREEN_WIDTH * 0.94,
                height: isFullscreen ? SCREEN_WIDTH : SCREEN_WIDTH * 0.56, // Adjust for fullscreen
                backgroundColor: colors.background,
              },
            ]}
            useNativeControls={false} // We'll implement custom controls
            isLooping
            shouldPlay={isPlaying}
            isMuted={isMuted}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            accessibilityLabel="Post Video"
            onFullscreenUpdate={(event: VideoFullscreenUpdateEvent) => {
              if (
                event.fullscreenUpdate ===
                VideoFullscreenUpdate.PLAYER_DID_DISMISS
              ) {
                dispatch({ type: 'SET_FULLSCREEN', payload: false });
              }
            }}
          />
          {showHeart && (
            <AnimatedHeart
              visible={showHeart}
              onAnimationComplete={handleAnimationComplete}
            />
          )}
          {/* Overlay Play/Pause Icon */}
          {!isPlaying && !isLoading && !hasError && (
            <View style={styles.overlay}>
              <FontAwesome name="play-circle" size={64} color="white" />
            </View>
          )}
          {isPlaying && (
            <View style={styles.overlay}>
              <FontAwesome name="pause-circle" size={64} color="white" />
            </View>
          )}
          {/* Loading Indicator */}
          {isLoading && (
            <ActivityIndicator
              style={styles.loadingIndicator}
              size="large"
              color={colors.primary}
              accessibilityLabel="Loading video"
            />
          )}
          {/* Error Message */}
          {hasError && (
            <View style={styles.errorContainer}>
              <FontAwesome name="exclamation-circle" size={48} color="red" />
              <Text style={[styles.errorText, { color: colors.text }]}>
                Failed to load video.
              </Text>
              <TouchableOpacity
                onPress={handleRetry}
                style={styles.retryButton}
                accessibilityLabel="Retry loading video"
                accessibilityRole="button"
              >
                <Text style={[styles.retryText, { color: colors.primary }]}>
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Animated Heart on Double Tap */}
          <Animated.View
            style={[
              styles.animatedHeart,
              {
                transform: [{ scale: heartScale }],
                opacity: heartScale.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1, 0],
                }),
              },
            ]}
            pointerEvents="none"
          >
            <AnimatedHeart visible={true} onAnimationComplete={() => {}} />
          </Animated.View>
          {/* Custom Controls */}
          {showControls && !hasError && (
            <Animated.View
              style={[styles.controls, { opacity: controlsOpacity }]}
            >
              {/* Play/Pause Button */}
              <TouchableOpacity
                onPress={togglePlayback}
                style={styles.controlButton}
                accessibilityLabel={isPlaying ? 'Pause video' : 'Play video'}
                accessibilityRole="button"
              >
                <FontAwesome
                  name={isPlaying ? 'pause' : 'play'}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              {/* Mute/Unmute Button */}
              <TouchableOpacity
                onPress={toggleMute}
                style={styles.controlButton}
                accessibilityLabel={isMuted ? 'Unmute video' : 'Mute video'}
                accessibilityRole="button"
              >
                <FontAwesome
                  name={isMuted ? 'volume-off' : 'volume-up'}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <Slider
                  style={styles.slider}
                  value={duration ? (position / duration) * 100 : 0}
                  onSlidingComplete={handleSeek}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.secondary}
                  thumbTintColor={colors.primary}
                  accessibilityLabel="Video progress slider"
                  accessibilityRole="adjustable"
                />
                <Text style={[styles.durationText, { color: colors.text }]}>
                  {formatTime(position)} / {durationText}
                </Text>
              </View>
              {/* Fullscreen Toggle */}
              <TouchableOpacity
                onPress={isFullscreen ? exitFullscreen : toggleFullscreen}
                style={styles.controlButton}
                accessibilityLabel={
                  isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'
                }
                accessibilityRole="button"
              >
                <MaterialIcons
                  name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </Animated.View>
          )}
        </TouchableOpacity>
      </GestureDetector>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  touchable: {
    position: 'relative',
  },
  video: {
    borderRadius: 16,
    backgroundColor: 'black',
  },
  overlay: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18, // Half of ActivityIndicator size
    marginTop: -18, // Half of ActivityIndicator size
  },
  errorContainer: {
    position: 'absolute',
    top: '40%',
    left: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular', // Adjust based on your typography
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  retryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium', // Adjust based on your typography
  },
  animatedHeart: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.3)', // Optional: Semi-transparent background
  },
  controlButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular', // Adjust based on your typography
    marginTop: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default memo(
  VideoPostComponent,
  (prevProps, nextProps) =>
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.videoUri === nextProps.post.videoUri &&
    prevProps.onDoubleTap === nextProps.onDoubleTap &&
    prevProps.isAutoplay === nextProps.isAutoplay,
);
