import React, { useCallback, memo, useMemo, useReducer } from 'react';
import { View } from 'react-native';
import { PostProps } from './types';
import { styles } from './styles';
import { postReducer } from './reducer';
import { PostType, TextPost, MediaPost } from '@/src/types/post';
import { PostHeader } from '@/src/components/molecules/Posts';
import { MediaPostComponent, TextPostComponent } from '..';
import ActionBar from '@/src/components/molecules/Posts/ActionBar';

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

  const handleLike = useCallback(
    () => dispatch({ type: 'TOGGLE_LIKE' }),
    [state.isLiked],
  );
  const handleSave = useCallback(() => dispatch({ type: 'TOGGLE_SAVE' }), []);
  const handleCommentPress = useCallback(() => {}, []);
  const handleShare = useCallback(
    () => dispatch({ type: 'INCREMENT_ECHO' }),
    [],
  );
  const handleOptionsPress = useCallback(() => {}, []);

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

  const renderContent = useMemo(() => {
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
              if (registerVideoRef) registerVideoRef(id, videoRef);
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
    isLiked,
    isSaved,
    handleLike,
    handleSave,
    handleShare,
    handleCommentPress,
    renderActionBar,
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

export default memo(
  Post,
  (prevProps, nextProps) =>
    prevProps.post.id === nextProps.post.id &&
    prevProps.isAutoplay === nextProps.isAutoplay,
);
