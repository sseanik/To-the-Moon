import forumConstants from "../constants/forumConstants";

const initialState = {
  addParent: {
    loading: false,
    error: null,
  },
  addChild: {
    loading: false,
    error: null,
  },
  getComments: {
    loading: false,
    error: null,
  },
  comments: [],
};

const forumReducer = (state = initialState, action) => {
  switch (action.type) {
    case forumConstants.ADD_PARENT_PENDING:
      return {
        ...state,
        addParent: { loading: true, error: null },
      };
    case forumConstants.ADD_PARENT_SUCCESS:
      return {
        ...state,
        addParent: {
          loading: false,
          error: null,
        },
        comments: [...state.comments, action.payload],
      };
    case forumConstants.ADD_PARENT_FAILURE:
      return {
        ...state,
        addParent: { loading: false, error: action.payload },
      };
    case forumConstants.ADD_CHILD_PENDING:
      return {
        ...state,
        addChild: { loading: true, error: null },
      };
    case forumConstants.ADD_CHILD_SUCCESS:
      return {
        ...state,
        addChild: {
          loading: false,
          error: null,
        },
        comments: [...state.comments, action.payload],
      };
    case forumConstants.ADD_CHILD_FAILURE:
      return {
        ...state,
        addChild: { loading: false, error: action.payload },
      };
    case forumConstants.GET_COMMENTS_PENDING:
      return {
        ...state,
        getComments: { loading: true, error: null },
      };
    case forumConstants.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        getComments: { loading: false, error: null },
        comments: action.payload,
      };
    case forumConstants.GET_COMMENTS_FAILURE:
      return {
        ...state,
        getComments: { loading: false, error: action.payload },
        comments: [],
      };
    default:
      return state;
  }
};

export default forumReducer;
