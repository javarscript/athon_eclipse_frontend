import { storiesTypes } from "../type/stories.type";

export function stories(state = {}, action) {
  switch (action.type) {
    case storiesTypes.GETSTORIES_REQUEST:
      return Object.assign({}, state)
    case storiesTypes.GETSTORIES_SUCCESS:
      return {
        ...state,
        user: action.payload
      };
    case storiesTypes.GETSTORIES_FAILURE:
      return {};
    case storiesTypes.POSTSTORIES_REQUEST:
      return {
        gettingstories: true,
      };
    case storiesTypes.POSTSTORIES_SUCCESS:
      return Object.assign({}, state, { user: action.payload })
    case storiesTypes.POSTSTORIES_FAILURE:
      return {};
    default:
      return state;
  }
}