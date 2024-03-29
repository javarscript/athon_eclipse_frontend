import { postsTypes } from '../type/posts.type';

export function posts(state = {}, action) {
  switch (action.type) {
    case postsTypes.GETPOSTS_REQUEST:
      return Object.assign({}, state)
    case postsTypes.GETPOSTS_SUCCESS:
      return {
        ...state,
        user: action.payload
      };
    case postsTypes.GETPOSTS_FAILURE:
      return {};
    case postsTypes.POSTPOSTS_REQUEST:
      return {
        gettingposts: true,
      };
    case postsTypes.POSTPOSTS_SUCCESS:
      return { ...state,
        user: action.payload}
    case postsTypes.POSTPOSTS_FAILURE:
      return {};
    default:
      return state;
  }
}
