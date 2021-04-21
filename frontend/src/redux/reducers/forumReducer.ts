import { Action } from "redux";
import { SimpleReduxState } from "../../types/generalTypes";
import forumConstants from "../constants/forumConstants";

const forumReducer = (state = initialState, action: ForumAction) => {
  switch (action.type) {
    case forumConstants.ADD_PARENT_PENDING:
      return {
        ...state,
        addParent: {
          loading: true,
          error: "",
        },
      };
    case forumConstants.ADD_PARENT_SUCCESS:
      return {
        ...state,
        addParent: {
          loading: false,
          error: "",
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
          error: "",
          adding: [...state.addChild.adding, action.payload],
        },
      };
    case forumConstants.ADD_CHILD_SUCCESS:
      return {
        ...state,
        addChild: {
          error: "",
          adding: state.addChild.adding.filter(
            (commentID) => commentID !== action.payload.comment_id
          ),
        },
        // insert the new reply first temporarily
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.comment_id
            ? { ...comment, replies: [action.payload, ...comment.replies!] }
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
        getComments: { loading: true, error: "" },
      };
    case forumConstants.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        getComments: { loading: false, error: "" },
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
          error: "",
          editing: [...state.editParent.editing, action.payload.commentID],
        },
      };
    case forumConstants.EDIT_PARENT_SUCCESS:
      return {
        ...state,
        editParent: {
          error: "",
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
          error: "",
          editing: state.editParent.editing.filter(
            (commentID) => commentID !== action.payload.comment_id
          ),
        },
      };
    case forumConstants.EDIT_CHILD_PENDING:
      return {
        ...state,
        editChild: {
          error: "",
          editing: [...state.editChild.editing, action.payload.commentID],
        },
      };
    case forumConstants.EDIT_CHILD_SUCCESS:
      return {
        ...state,
        editChild: {
          error: "",
          editing: state.editChild.editing.filter(
            (commentID) => commentID !== action.payload.reply_id
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.comment_id
            ? {
                ...comment,
                replies: comment.replies!.map((reply) =>
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
          error: "",
          editing: state.editChild.editing.filter(
            (commentID) => commentID !== action.payload.comment_id
          ),
        },
      };
    case forumConstants.DELETE_PARENT_PENDING:
      return {
        ...state,
        deleteParent: {
          error: "",
          deleting: [...state.deleteParent.deleting, action.payload],
        },
      };
    case forumConstants.DELETE_PARENT_SUCCESS:
      return {
        ...state,
        deleteParent: {
          error: "",
          deleting: state.deleteParent.deleting.filter(
            (commentID) => commentID !== action.payload.commentID
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.commentID
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
          error: "",
          deleting: [...state.deleteChild.deleting, action.payload],
        },
      };
    case forumConstants.DELETE_CHILD_SUCCESS:
      return {
        ...state,
        deleteChild: {
          error: "",
          deleting: state.deleteChild.deleting.filter(
            (commentID) => commentID !== action.payload.commentID
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.parentID
            ? {
                ...comment,
                replies: comment.replies!.map((reply) =>
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
          error: "",
          upvoting: [...state.upvoteParent.upvoting, action.payload],
        },
      };
    case forumConstants.UPVOTE_PARENT_SUCCESS:
      return {
        ...state,
        upvoteParent: {
          error: "",
          upvoting: state.upvoteParent.upvoting.filter(
            (commentID) => commentID !== action.payload.commentID
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.commentID
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
          error: "",
          upvoting: [...state.upvoteChild.upvoting, action.payload],
        },
      };
    case forumConstants.UPVOTE_CHILD_SUCCESS:
      return {
        ...state,
        upvoteChild: {
          error: "",
          upvoting: state.upvoteChild.upvoting.filter(
            (commentID) => commentID !== action.payload.commentID
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.parentID
            ? {
                ...comment,
                replies: comment.replies!.map((reply) =>
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
          error: "",
          downvoting: [...state.downvoteParent.downvoting, action.payload],
        },
      };
    case forumConstants.DOWNVOTE_PARENT_SUCCESS:
      return {
        ...state,
        downvoteParent: {
          error: "",
          downvoting: state.downvoteParent.downvoting.filter(
            (commentID) => commentID !== action.payload.commentID
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.commentID
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
          error: "",
          downvoting: [...state.downvoteChild.downvoting, action.payload],
        },
      };
    case forumConstants.DOWNVOTE_CHILD_SUCCESS:
      return {
        ...state,
        downvoteChild: {
          error: "",
          downvoting: state.downvoteChild.downvoting.filter(
            (commentID) => commentID !== action.payload.commentID
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.parentID
            ? {
                ...comment,
                replies: comment.replies!.map((reply) =>
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
    case forumConstants.REMOVE_UPVOTE_PARENT_PENDING:
      return {
        ...state,
        removeUpvoteParent: {
          error: "",
          removing: [...state.removeUpvoteParent.removing, action.payload],
        },
      };
    case forumConstants.REMOVE_UPVOTE_PARENT_SUCCESS:
      return {
        ...state,
        removeUpvoteParent: {
          error: "",
          removing: state.removeUpvoteParent.removing.filter(
            (commentID) => commentID !== action.payload.commentID
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.commentID
            ? {
                ...comment,
                is_upvoted: false,
                upvotes: comment.upvotes - 1,
                vote_difference: comment.vote_difference - 1,
              }
            : comment
        ),
      };
    case forumConstants.REMOVE_UPVOTE_PARENT_FAILURE:
      return {
        ...state,
        removeUpvoteParent: {
          error: action.payload,
          removing: [],
        },
      };
    case forumConstants.REMOVE_UPVOTE_CHILD_PENDING:
      return {
        ...state,
        removeUpvoteChild: {
          error: "",
          removing: [...state.removeUpvoteChild.removing, action.payload],
        },
      };
    case forumConstants.REMOVE_UPVOTE_CHILD_SUCCESS:
      return {
        ...state,
        removeUpvoteChild: {
          error: "",
          removing: state.removeUpvoteChild.removing.filter(
            (commentID) => commentID !== action.payload.commentID
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.parentID
            ? {
                ...comment,
                replies: comment.replies!.map((reply) =>
                  reply.reply_id === action.payload.commentID
                    ? {
                        ...reply,
                        is_upvoted: false,
                        upvotes: reply.upvotes - 1,
                        vote_difference: reply.vote_difference - 1,
                      }
                    : reply
                ),
              }
            : comment
        ),
      };
    case forumConstants.REMOVE_UPVOTE_CHILD_FAILURE:
      return {
        ...state,
        removeUpvoteChild: {
          error: action.payload,
          removing: [],
        },
      };
    case forumConstants.REMOVE_DOWNVOTE_PARENT_PENDING:
      return {
        ...state,
        removeDownvoteParent: {
          error: "",
          removing: [...state.removeDownvoteParent.removing, action.payload],
        },
      };
    case forumConstants.REMOVE_DOWNVOTE_PARENT_SUCCESS:
      return {
        ...state,
        removeDownvoteParent: {
          error: "",
          removing: state.removeDownvoteParent.removing.filter(
            (commentID) => commentID !== action.payload.commentID
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.commentID
            ? {
                ...comment,
                is_downvoted: false,
                downvotes: comment.downvotes - 1,
                vote_difference: comment.vote_difference + 1,
              }
            : comment
        ),
      };
    case forumConstants.REMOVE_DOWNVOTE_PARENT_FAILURE:
      return {
        ...state,
        removeDownvoteParent: {
          error: action.payload,
          removing: [],
        },
      };
    case forumConstants.REMOVE_DOWNVOTE_CHILD_PENDING:
      return {
        ...state,
        removeDownvoteChild: {
          error: "",
          removing: [...state.removeDownvoteChild.removing, action.payload],
        },
      };
    case forumConstants.REMOVE_DOWNVOTE_CHILD_SUCCESS:
      return {
        ...state,
        removeDownvoteChild: {
          error: "",
          removing: state.removeDownvoteChild.removing.filter(
            (commentID) => commentID !== action.payload.commentID
          ),
        },
        comments: state.comments.map((comment) =>
          comment.comment_id === action.payload.parentID
            ? {
                ...comment,
                replies: comment.replies!.map((reply) =>
                  reply.reply_id === action.payload.commentID
                    ? {
                        ...reply,
                        is_downvoted: false,
                        downvotes: reply.downvotes - 1,
                        vote_difference: reply.vote_difference + 1,
                      }
                    : reply
                ),
              }
            : comment
        ),
      };
    case forumConstants.REMOVE_DOWNVOTE_CHILD_FAILURE:
      return {
        ...state,
        removeDownvoteChild: {
          error: action.payload,
          removing: [],
        },
      };
    default:
      return state;
  }
};

interface ForumAction extends Action {
  payload: {
    comment_id?: string;
    commentID?: string;
    parentID?: string;
    reply_id?: string;
    content?: string;
  };
}

interface Comment {
  comment_id: string;
  reply_id?: string;
  stock_ticker: string;
  username: string;
  time_stamp: number;
  content: string;
  is_edited: boolean;
  is_deleted: boolean;
  is_upvoted: boolean;
  is_downvoted: boolean;
  upvotes: number;
  downvotes: number;
  vote_difference: number;
  replies?: Comment[];
}

interface AddChildState {
  adding: string[];
  error: string;
}

interface EditingState {
  editing: string[];
  error: string;
}

interface DeletingState {
  deleting: string[];
  error: string;
}

interface UpvotingState {
  upvoting: string[];
  error: string;
}

interface DownvotingState {
  downvoting: string[];
  error: string;
}

interface RemovingState {
  removing: string[];
  error: string;
}

interface InitialState {
  addParent: SimpleReduxState;
  addChild: AddChildState;
  getComments: SimpleReduxState;
  editParent: EditingState;
  editChild: EditingState;
  deleteParent: DeletingState;
  deleteChild: DeletingState;
  upvoteParent: UpvotingState;
  upvoteChild: UpvotingState;
  downvoteParent: DownvotingState;
  downvoteChild: DownvotingState;
  removeUpvoteParent: RemovingState;
  removeUpvoteChild: RemovingState;
  removeDownvoteParent: RemovingState;
  removeDownvoteChild: RemovingState;
  comments: Comment[];
}

const initialState: InitialState = {
  addParent: {
    loading: false,
    error: "",
  },
  addChild: {
    error: "",
    adding: [],
  },
  getComments: {
    loading: false,
    error: "",
  },
  editParent: {
    editing: [],
    error: "",
  },
  editChild: {
    editing: [],
    error: "",
  },
  deleteParent: {
    deleting: [],
    error: "",
  },
  deleteChild: {
    deleting: [],
    error: "",
  },
  upvoteParent: {
    upvoting: [],
    error: "",
  },
  upvoteChild: {
    upvoting: [],
    error: "",
  },
  downvoteParent: {
    downvoting: [],
    error: "",
  },
  downvoteChild: {
    downvoting: [],
    error: "",
  },
  removeUpvoteParent: {
    removing: [],
    error: "",
  },
  removeUpvoteChild: {
    removing: [],
    error: "",
  },
  removeDownvoteParent: {
    removing: [],
    error: "",
  },
  removeDownvoteChild: {
    removing: [],
    error: "",
  },
  comments: [],
};

export default forumReducer;
