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
  deleteParent: {
    deleting: [],
    error: null,
  },
  deleteChild: {
    deleting: [],
    error: null,
  },
  upvoteParent: {
    upvoting: [],
    error: null,
  },
  upvoteChild: {
    upvoting: [],
    error: null,
  },
  downvoteParent: {
    downvoting: [],
    error: null,
  },
  downvoteChild: {
    downvoting: [],
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
            (commentID) => commentID !== action.payload.comment_id
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
            (commentID) => commentID !== action.payload.comment_id
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
            (commentID) => commentID !== action.payload.comment_id
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.comment_id
            ? { ...comment, content: action.payload.content, is_edited: true }
            : comment
        ),
      };
    case forumConstants.EDIT_PARENT_FAILURE:
      return {
        ...state,
        editParent: {
          error: null,
          editing: state.editParent.editing.filter(
            (commentID) => commentID !== action.payload.comment_id
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
            (commentID) => commentID !== action.payload.reply_id
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.comment_id
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.reply_id === action.payload.reply_id
                    ? {
                        ...reply,
                        content: action.payload.content,
                        is_edited: true,
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
            (commentID) => commentID !== action.payload.comment_id
          ),
        },
      };
    case forumConstants.DELETE_PARENT_PENDING:
      return {
        ...state,
        deleteParent: {
          error: null,
          deleting: [...state.deleteParent.deleting, action.payload],
        },
      };
    case forumConstants.DELETE_PARENT_SUCCESS:
      return {
        ...state,
        deleteParent: {
          error: null,
          deleting: state.deleteParent.deleting.filter(
            (commentID) => commentID !== action.payload
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload
            ? { ...comment, is_deleted: true }
            : comment
        ),
      };
    case forumConstants.DELETE_PARENT_FAILURE:
      return {
        ...state,
        deleteParent: {
          error: action.payload,
          deleting: [],
        },
      };
    case forumConstants.DELETE_CHILD_PENDING:
      return {
        ...state,
        deleteChild: {
          error: null,
          deleting: [...state.deleteChild.deleting, action.payload],
        },
      };
    case forumConstants.DELETE_CHILD_SUCCESS:
      return {
        ...state,
        deleteChild: {
          error: null,
          deleting: state.deleteChild.deleting.filter(
            (commentID) => commentID !== action.payload.commentID
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.parentID
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.reply_id === action.payload.commentID
                    ? { ...reply, is_deleted: true }
                    : reply
                ),
              }
            : comment
        ),
      };
    case forumConstants.DELETE_CHILD_FAILURE:
      return {
        ...state,
        deleteChild: {
          error: action.payload,
          deleting: [],
        },
      };
    case forumConstants.UPVOTE_PARENT_PENDING:
      return {
        ...state,
        upvoteParent: {
          error: null,
          upvoting: [...state.upvoteParent.upvoting, action.payload],
        },
      };
    case forumConstants.UPVOTE_PARENT_SUCCESS:
      return {
        ...state,
        upvoteParent: {
          error: null,
          upvoting: state.upvoteParent.upvoting.filter(
            (commentID) => commentID !== action.payload
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload
            ? {
                ...comment,
                is_upvoted: true,
                upvotes: comment.upvotes + 1,
                downvotes: comment.is_downvoted
                  ? comment.downvotes - 1
                  : comment.downvotes,
                vote_difference: comment.is_downvoted
                  ? comment.vote_difference + 2
                  : comment.vote_difference + 1,
                is_downvoted: false,
              }
            : comment
        ),
      };
    case forumConstants.UPVOTE_PARENT_FAILURE:
      return {
        ...state,
        upvoteParent: {
          error: action.payload,
          upvoting: [],
        },
      };
    case forumConstants.UPVOTE_CHILD_PENDING:
      return {
        ...state,
        upvoteChild: {
          error: null,
          upvoting: [...state.upvoteChild.upvoting, action.payload],
        },
      };
    case forumConstants.UPVOTE_CHILD_SUCCESS:
      return {
        ...state,
        upvoteChild: {
          error: null,
          upvoting: state.upvoteChild.upvoting.filter(
            (commentID) => commentID !== action.payload.commentID
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.parentID
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.reply_id === action.payload.commentID
                    ? {
                        ...reply,
                        is_upvoted: true,
                        upvotes: reply.upvotes + 1,
                        downvotes: reply.is_downvoted
                          ? reply.downvotes - 1
                          : reply.downvotes,
                        vote_difference: reply.is_downvoted
                          ? reply.vote_difference + 2
                          : reply.vote_difference + 1,
                        is_downvoted: false,
                      }
                    : reply
                ),
              }
            : comment
        ),
      };
    case forumConstants.UPVOTE_CHILD_FAILURE:
      return {
        ...state,
        upvoteChild: {
          error: action.payload,
          upvoting: [],
        },
      };
    case forumConstants.DOWNVOTE_PARENT_PENDING:
      return {
        ...state,
        downvoteParent: {
          error: null,
          downvoting: [...state.downvoteParent.downvoting, action.payload],
        },
      };
    case forumConstants.DOWNVOTE_PARENT_SUCCESS:
      return {
        ...state,
        downvoteParent: {
          error: null,
          downvoting: state.downvoteParent.downvoting.filter(
            (commentID) => commentID !== action.payload
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload
            ? {
                ...comment,
                is_downvoted: true,
                downvotes: comment.downvotes + 1,
                upvotes: comment.is_upvoted
                  ? comment.upvotes - 1
                  : comment.upvotes,
                vote_difference: comment.is_upvoted
                  ? comment.vote_difference - 2
                  : comment.vote_difference - 1,
                is_upvoted: false,
              }
            : comment
        ),
      };
    case forumConstants.DOWNVOTE_PARENT_FAILURE:
      return {
        ...state,
        downvoteParent: {
          error: action.payload,
          downvoting: [],
        },
      };
    case forumConstants.DOWNVOTE_CHILD_PENDING:
      return {
        ...state,
        downvoteChild: {
          error: null,
          downvoting: [...state.downvoteChild.downvoting, action.payload],
        },
      };
    case forumConstants.DOWNVOTE_CHILD_SUCCESS:
      return {
        ...state,
        downvoteChild: {
          error: null,
          downvoting: state.downvoteChild.downvoting.filter(
            (commentID) => commentID !== action.payload.commentID
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.parentID
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.reply_id === action.payload.commentID
                    ? {
                        ...reply,
                        is_downvoted: true,
                        downvotes: reply.downvotes + 1,
                        upvotes: reply.is_upvoted
                          ? reply.upvotes - 1
                          : reply.upvotes,
                        vote_difference: reply.is_upvoted
                          ? reply.vote_difference - 2
                          : reply.vote_difference - 1,
                        is_upvoted: false,
                      }
                    : reply
                ),
              }
            : comment
        ),
      };
    case forumConstants.DOWNVOTE_CHILD_FAILURE:
      return {
        ...state,
        downvoteChild: {
          error: action.payload,
          downvoting: [],
        },
      };
    default:
      return state;
  }
};

export default forumReducer;
