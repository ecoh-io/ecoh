export interface PostState {
  isLiked: boolean;
  likesCount: number;
  echoCount: number;
  isSaved: boolean;
}

export type PostAction =
  | { type: 'TOGGLE_LIKE' }
  | { type: 'TOGGLE_SAVE' }
  | { type: 'INCREMENT_ECHO' };

export const postReducer = (
  state: PostState,
  action: PostAction,
): PostState => {
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
