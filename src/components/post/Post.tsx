import React, { useCallback, memo, useMemo, useReducer } from 'react';
import { View, StyleSheet, Dimensions, LayoutChangeEvent } from 'react-native';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';
import ImagePostComponent from './Image/ImagePost';
import VideoPostComponent, { VideoPostComponentProps } from './Video/VideoPost';
import TextPostComponent from './Text/TextPost';
import { ImagePost, PostData, TextPost, VideoPost } from '@/src/types/post';

export enum PostType {
  IMAGE = 'image',
  TEXT = 'text',
  VIDEO = 'video',
}

interface PostProps {
  post: PostData;
  isAutoplay?: boolean;
  registerVideoRef?: (id: number, ref: any) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PostState {
  isLiked: boolean;
  likesCount: number;
  sharesCount: number;
  isSaved: boolean;
}

type PostAction =
  | { type: 'TOGGLE_LIKE' }
  | { type: 'TOGGLE_SAVE' }
  | { type: 'INCREMENT_SHARE' };

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
    case 'INCREMENT_SHARE':
      return { ...state, sharesCount: state.sharesCount + 1 };
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
    type,
    isLiked: initialLiked,
    likes: initialLikes,
    shares: initialShares,
    isSaved: initialSaved,
    comments,
    user,
    timestamp,
  } = post;

  const [state, dispatch] = useReducer(postReducer, {
    isLiked: initialLiked,
    likesCount: initialLikes,
    sharesCount: initialShares,
    isSaved: initialSaved,
  });

  const { isLiked, likesCount, sharesCount, isSaved } = state;

  const handleLike = useCallback(() => {
    dispatch({ type: 'TOGGLE_LIKE' });
  }, []);

  const handleSave = useCallback(() => {
    dispatch({ type: 'TOGGLE_SAVE' });
  }, []);

  const handleCommentPress = useCallback(() => {
    // Navigate to comments screen or open modal.
  }, []);

  const handleShare = useCallback(() => {
    dispatch({ type: 'INCREMENT_SHARE' });
  }, []);

  const handleOptionsPress = useCallback(() => {
    // Show options menu.
  }, []);

  const renderContent = useMemo(() => {
    switch (type) {
      case PostType.IMAGE:
        return <ImagePostComponent post={post as ImagePost} />;
      case PostType.TEXT:
        return (
          <TextPostComponent post={post as TextPost} onDoubleTap={handleLike} />
        );
      case PostType.VIDEO:
        return (
          <VideoPostComponent
            // Pass the ref callback so the parent (feed manager) can register this video instance.
            ref={(ref) => {
              if (registerVideoRef) {
                registerVideoRef(post.id, ref);
              }
            }}
            post={post as VideoPost}
            isAutoplay={isAutoplay}
            onDoubleTap={handleLike}
          />
        );
      default:
        console.warn(`Unsupported post type: ${type}`);
        return null;
    }
  }, [type, post, handleLike, isAutoplay, registerVideoRef]);

  return (
    <View style={styles.postContainer} onLayout={onLayout}>
      <PostHeader
        user={user}
        timestamp={timestamp}
        onOptionsPress={handleOptionsPress}
      />
      <View style={styles.content}>{renderContent}</View>
      <View style={styles.footer}>
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
