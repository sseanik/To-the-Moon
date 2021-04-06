import forumConstants from "../constants/forumConstants";

const initialState = {
  addParent: {
    loading: false,
    error: null,
  },
  addChild: {
    error: null,
    adding: [],
  },
  getComments: {
    loading: false,
    error: null,
  },
  editParent: {
    editing: [],
    error: null,
  },
  editChild: {
    editing: [],
    error: null,
  },
  comments: [],
};

const forumReducer = (state = initialState, action) => {
  switch (action.type) {
    case forumConstants.ADD_PARENT_PENDING:
      return {
        ...state,
        addParent: {
          loading: true,
          error: null,
        },
      };
    case forumConstants.ADD_PARENT_SUCCESS:
      return {
        ...state,
        addParent: {
          loading: false,
          error: null,
        },
        comments: [action.payload, ...state.comments],
      };
    case forumConstants.ADD_PARENT_FAILURE:
      return {
        ...state,
        addParent: {
          loading: false,
          error: action.payload,
        },
      };
    case forumConstants.ADD_CHILD_PENDING:
      return {
        ...state,
        addChild: {
          error: null,
          adding: [...state.addChild.adding, action.payload],
        },
      };
    case forumConstants.ADD_CHILD_SUCCESS:
      return {
        ...state,
        addChild: {
          error: null,
          adding: state.addChild.adding.filter(
            (commentID) => commentID === action.payload
          ),
        },
        // insert the new reply first temporarily
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.comment_id
            ? { ...comment, replies: [action.payload, ...comment.replies] }
            : comment
        ),
      };
    case forumConstants.ADD_CHILD_FAILURE:
      return {
        ...state,
        addChild: {
          error: action.payload,
          adding: state.addChild.adding.filter(
            (commentID) => commentID === action.payload
          ),
        },
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
    case forumConstants.EDIT_PARENT_PENDING:
      return {
        ...state,
        editParent: {
          error: null,
          editing: [...state.editParent.editing, action.payload.commentID],
        },
      };
    case forumConstants.EDIT_PARENT_SUCCESS:
      return {
        ...state,
        editParent: {
          error: null,
          editing: state.editParent.editing.filter(
            (commentID) => commentID === action.payload
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.comment_id
            ? { ...comment, content: action.payload.content }
            : comment
        ),
      };
    case forumConstants.EDIT_PARENT_FAILURE:
      return {
        ...state,
        editParent: {
          error: null,
          editing: state.editParent.editing.filter(
            (commentID) => commentID === action.payload
          ),
        },
      };
    case forumConstants.EDIT_CHILD_PENDING:
      return {
        ...state,
        editChild: {
          error: null,
          editing: [...state.editChild.editing, action.payload.commentID],
        },
      };
    case forumConstants.EDIT_CHILD_SUCCESS:
      return {
        ...state,
        editChild: {
          error: null,
          editing: state.editChild.editing.filter(
            (commentID) => commentID === action.payload
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.parent_id
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.reply_id === action.payload.comment_id
                    ? {
                        ...reply,
                        content: action.payload.content,
                      }
                    : reply
                ),
              }
            : comment
        ),
      };
    case forumConstants.EDIT_CHILD_FAILURE:
      return {
        ...state,
        editChild: {
          error: null,
          editing: state.editChild.editing.filter(
            (commentID) => commentID === action.payload
          ),
        },
      };
    default:
      return state;
  }
};

export default forumReducer;
