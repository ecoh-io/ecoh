// src/components/Posts/Post.tsx
import React, {
  useCallback,
  memo,
  useMemo,
  useReducer,
  useEffect,
} from 'react';
import { View, StyleSheet, Dimensions, LayoutChangeEvent } from 'react-native';
import TextPostComponent from './TextPost/TextPost';
import MediaPostComponent from './MediaPost/MediaPost';

import { PostType, PostData, TextPost, MediaPost } from '@/src/types/post';
import PostHeader from './PostHeader';
import { VideoRefHandle } from '../Feed/withFeedManager';
import ActionBar from './ActionBar';

interface PostProps {
  post: PostData;
  isAutoplay?: boolean;
  registerVideoRef?: (id: string, ref: VideoRefHandle | null) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PostState {
  isLiked: boolean;
  likesCount: number;
  echoCount: number;
  isSaved: boolean;
}

type PostAction =
  | { type: 'TOGGLE_LIKE' }
  | { type: 'TOGGLE_SAVE' }
  | { type: 'INCREMENT_ECHO' };

const postReducer = (state: PostState, action: PostAction): PostState => {
  switch (action.type) {
    case 'TOGGLE_LIKE':
      return {
        ...state,
        isLiked: !state.isLiked,
        likesCount: state.likesCount + (state.isLiked ? -1 : 1),
      };
    case 'TOGGLE_SAVE':
      return { ...state, isSaved: !state.isSaved };
    case 'INCREMENT_ECHO':
      return { ...state, echoCount: state.echoCount + 1 };
    default:
      return state;
  }
};

const Post: React.FC<PostProps> = ({
  post,
  isAutoplay = false,
  registerVideoRef,
  onLayout,
}) => {
  const {
    id,
    type,
    isLiked: initialLiked,
    likes: initialLikes,
    echo: initialShares,
    isSaved: initialSaved,
    comments,
    user,
    timestamp,
  } = post;

  const [state, dispatch] = useReducer(postReducer, {
    isLiked: initialLiked,
    likesCount: initialLikes,
    echoCount: initialShares,
    isSaved: initialSaved,
  });

  const { isLiked, likesCount, echoCount, isSaved } = state;

  const handleLike = useCallback(() => {
    dispatch({ type: 'TOGGLE_LIKE' });
  }, [state.isLiked]); // Add state.isLiked to the dependency array

  const handleSave = useCallback(() => {
    dispatch({ type: 'TOGGLE_SAVE' });
  }, []);

  const handleCommentPress = useCallback(() => {
    // navigate to comments screen or open a modal
  }, []);

  const handleShare = useCallback(() => {
    dispatch({ type: 'INCREMENT_ECHO' });
  }, []);

  const handleOptionsPress = useCallback(() => {
    // show an options menu
  }, []);

  const renderActionBar = useCallback(
    () => (
      <ActionBar
        likes={likesCount}
        commentsCount={comments.length}
        isLiked={isLiked}
        isSaved={isSaved}
        onLike={handleLike}
        onCommentPress={handleCommentPress}
        onShare={handleShare}
        onSave={handleSave}
        echoCount={echoCount}
      />
    ),
    [
      likesCount,
      comments.length,
      isLiked,
      isSaved,
      echoCount,
      handleLike,
      handleCommentPress,
      handleShare,
      handleSave,
    ],
  );

  /**
   * Render the post content based on its type.
   */
  const renderContent = useMemo(() => {
    // Create common props for the action bar and post content.
    const commonProps = {
      post,
      isLiked,
      isSaved,
      onLike: handleLike,
      onCommentPress: handleCommentPress,
      onShare: handleShare,
      onSave: handleSave,
      renderActionBar,
    };

    switch (type) {
      case PostType.TEXT:
        return <TextPostComponent {...commonProps} post={post as TextPost} />;
      case PostType.MEDIA:
        return (
          <MediaPostComponent
            {...commonProps}
            post={post as MediaPost}
            onVideoRefReady={(videoRef) => {
              if (registerVideoRef) {
                registerVideoRef(id, videoRef);
              }
            }}
          />
        );
      default:
        console.warn(`Unsupported post type: ${type}`);
        return null;
    }
  }, [
    type,
    post,
    handleLike,
    isAutoplay,
    registerVideoRef,
    handleSave,
    id,
    state,
  ]);

  return (
    <View style={styles.postContainer} onLayout={onLayout}>
      <PostHeader
        user={user}
        timestamp={timestamp}
        onOptionsPress={handleOptionsPress}
      />

      <View style={styles.content}>{renderContent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    width: SCREEN_WIDTH,
    alignSelf: 'center',
    overflow: 'hidden',
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    flexDirection: 'column',
    gap: 14,
    paddingVertical: 10,
  },
  content: {
    marginLeft: 0,
  },
  footer: {
    paddingLeft: 0,
  },
});

export default memo(
  Post,
  (prevProps, nextProps) =>
    prevProps.post.id === nextProps.post.id &&
    prevProps.isAutoplay === nextProps.isAutoplay,
);
