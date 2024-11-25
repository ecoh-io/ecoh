import React, { useCallback, memo, useMemo, useReducer } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';
import ImagePostComponent from './ImagePost';
import VideoPostComponent from './VideoPost';
import TextPostComponent from './TextPost';
import { ImagePost, PostData, TextPost, VideoPost } from '@/src/types/post';

export enum PostType {
  IMAGE = 'image',
  TEXT = 'text',
  VIDEO = 'video',
}

interface PostProps {
  post: PostData;
  isAutoplay?: boolean; // Controls autoplay for video posts
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Define the state shape for the reducer
interface PostState {
  isLiked: boolean;
  likesCount: number;
  sharesCount: number;
  isSaved: boolean;
}

// Define action types using TypeScript discriminated unions for better type safety
type PostAction =
  | { type: 'TOGGLE_LIKE' }
  | { type: 'TOGGLE_SAVE' }
  | { type: 'INCREMENT_SHARE' };

// Reducer function to manage post state
const postReducer = (state: PostState, action: PostAction): PostState => {
  switch (action.type) {
    case 'TOGGLE_LIKE':
      return {
        ...state,
        isLiked: !state.isLiked,
        likesCount: state.likesCount + (state.isLiked ? -1 : 1),
      };
    case 'TOGGLE_SAVE':
      return {
        ...state,
        isSaved: !state.isSaved,
      };
    case 'INCREMENT_SHARE':
      return {
        ...state,
        sharesCount: state.sharesCount + 1,
      };
    default:
      return state;
  }
};

const Post: React.FC<PostProps> = ({ post, isAutoplay = false }) => {
  // Destructure post data for better readability
  const {
    type,
    isLiked: initialLiked,
    likes: initialLikes,
    shares: initialShares,
    isSaved: initialSaved,
    comments,
    user,
    timestamp,
  } = post;

  // Initialize reducer for state management
  const [state, dispatch] = useReducer(postReducer, {
    isLiked: initialLiked,
    likesCount: initialLikes,
    sharesCount: initialShares,
    isSaved: initialSaved,
  });

  const { isLiked, likesCount, sharesCount, isSaved } = state;

  // Handlers with accurate dependencies to prevent unnecessary re-creations
  const handleLike = useCallback(() => {
    dispatch({ type: 'TOGGLE_LIKE' });
    // TODO: Make API call to update like status
  }, []);

  const handleSave = useCallback(() => {
    dispatch({ type: 'TOGGLE_SAVE' });
    // TODO: Make API call to update save status
  }, []);

  const handleCommentPress = useCallback(() => {
    // TODO: Navigate to comments screen or open comments modal
  }, []);

  const handleShare = useCallback(() => {
    dispatch({ type: 'INCREMENT_SHARE' });
    // TODO: Implement share functionality
  }, []);

  const handleOptionsPress = useCallback(() => {
    // TODO: Show options menu using a modal or action sheet
  }, []);

  // Memoized content rendering based on post type to prevent unnecessary renders
  const renderContent = useMemo(() => {
    switch (type) {
      case PostType.IMAGE:
        return (
          <ImagePostComponent
            post={post as ImagePost}
            onDoubleTap={handleLike}
          />
        );
      case PostType.TEXT:
        return (
          <TextPostComponent post={post as TextPost} onDoubleTap={handleLike} />
        );
      case PostType.VIDEO:
        return (
          <VideoPostComponent
            post={post as VideoPost}
            isAutoplay={isAutoplay}
            onDoubleTap={handleLike}
          />
        );
      default:
        console.warn(`Unsupported post type: ${type}`);
        return null;
    }
  }, [type, post, handleLike, isAutoplay]);

  return (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <PostHeader
        user={user}
        timestamp={timestamp}
        onOptionsPress={handleOptionsPress}
      />

      {/* Post Content */}
      {renderContent}

      {/* Post Footer */}
      <PostFooter
        likes={likesCount}
        commentsCount={comments.length}
        isLiked={isLiked}
        isSaved={isSaved}
        onLike={handleLike}
        onCommentPress={handleCommentPress}
        onShare={handleShare}
        onSave={handleSave}
        sharesCount={sharesCount}
      />
    </View>
  );
};

// Stylesheet with enhanced styling and comments
const styles = StyleSheet.create({
  postContainer: {
    width: SCREEN_WIDTH,
    alignSelf: 'center',
    overflow: 'hidden',
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#fff', // Ensures a consistent background
    paddingVertical: 10, // Adds vertical spacing
    paddingHorizontal: 10, // Adds horizontal padding for better content spacing
  },
});

export default memo(
  Post,
  (prevProps, nextProps) =>
    prevProps.post.id === nextProps.post.id &&
    prevProps.isAutoplay === nextProps.isAutoplay,
);
