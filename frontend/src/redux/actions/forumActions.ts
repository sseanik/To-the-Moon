import { Dispatch } from "redux";
import forumAPI from "../../api/forum";
import forumConstants from "../constants/forumConstants";

const forumActions = {
  addParentPending: () => ({
    type: forumConstants.ADD_PARENT_PENDING,
  }),
  addParentSuccess: (response: string) => ({
    type: forumConstants.ADD_PARENT_SUCCESS,
    payload: response,
  }),
  addParentFailure: (error: string) => ({
    type: forumConstants.ADD_PARENT_FAILURE,
    payload: error,
  }),
  addParent: (payload: AddCommentPayload) => async (dispatch: Dispatch) => {
    dispatch(forumActions.addParentPending());
    try {
      const { stockTicker, timestamp, content } = payload;
      const { comment } = await forumAPI.addComment(
        stockTicker,
        timestamp,
        content
      );
      dispatch(forumActions.addParentSuccess(comment));
    } catch (error) {
      dispatch(forumActions.addParentFailure(error.message));
    }
  },
  addChildPending: (parentID: string) => ({
    type: forumConstants.ADD_CHILD_PENDING,
    payload: parentID,
  }),
  addChildSuccess: (response: Comment) => ({
    type: forumConstants.ADD_CHILD_SUCCESS,
    payload: response,
  }),
  addChildFailure: (error: string) => ({
    type: forumConstants.ADD_CHILD_FAILURE,
    payload: error,
  }),
  addChild: (payload: AddCommentPayload) => async (dispatch: Dispatch) => {
    const { stockTicker, timestamp, content, parentID } = payload;
    dispatch(forumActions.addChildPending(parentID!));
    try {
      const { comment } = await forumAPI.addComment(
        stockTicker,
        timestamp,
        content,
        parentID!
      );
      dispatch(forumActions.addChildSuccess(comment));
    } catch (error) {
      dispatch(forumActions.addChildFailure(error.message));
    }
  },
  getCommentsPending: () => ({
    type: forumConstants.GET_COMMENTS_PENDING,
  }),
  getCommentsSuccess: (response: string) => ({
    type: forumConstants.GET_COMMENTS_SUCCESS,
    payload: response,
  }),
  getCommentsFailure: (error: string) => ({
    type: forumConstants.GET_COMMENTS_FAILURE,
    payload: error,
  }),
  getComments: (stockTicker: string) => async (dispatch: Dispatch) => {
    dispatch(forumActions.getCommentsPending());
    try {
      const { comments } = await forumAPI.getComments(stockTicker);
      dispatch(forumActions.getCommentsSuccess(comments));
    } catch (error) {
      dispatch(forumActions.getCommentsFailure(error.message));
    }
  },
  editParentPending: (payload: EditCommentPayload) => ({
    type: forumConstants.EDIT_PARENT_PENDING,
    payload,
  }),
  editParentSuccess: (response: string) => ({
    type: forumConstants.EDIT_PARENT_SUCCESS,
    payload: response,
  }),
  editParentFailure: (error: string) => ({
    type: forumConstants.EDIT_PARENT_FAILURE,
    payload: error,
  }),
  editParent: (payload: EditCommentPayload) => async (dispatch: Dispatch) => {
    dispatch(forumActions.editParentPending(payload));
    try {
      const { commentID, timestamp, content } = payload;
      const { comment } = await forumAPI.editComment(
        commentID,
        timestamp,
        content
      );
      dispatch(forumActions.editParentSuccess(comment));
    } catch (error) {
      dispatch(forumActions.editParentFailure(error.message));
    }
  },
  editChildPending: (payload: EditCommentPayload) => ({
    type: forumConstants.EDIT_CHILD_PENDING,
    payload,
  }),
  editChildSuccess: (response: string) => ({
    type: forumConstants.EDIT_CHILD_SUCCESS,
    payload: response,
  }),
  editChildFailure: (error: string) => ({
    type: forumConstants.EDIT_CHILD_FAILURE,
    payload: error,
  }),
  editChild: (payload: EditCommentPayload) => async (dispatch: Dispatch) => {
    dispatch(forumActions.editChildPending(payload));
    try {
      const { commentID, timestamp, content, parentID } = payload;
      const { comment } = await forumAPI.editComment(
        commentID,
        timestamp,
        content,
        parentID!
      );
      dispatch(forumActions.editChildSuccess(comment));
    } catch (error) {
      dispatch(forumActions.editChildFailure(error.message));
    }
  },
  deleteParentPending: (commentID: string) => ({
    type: forumConstants.DELETE_PARENT_PENDING,
    payload: commentID,
  }),
  deleteParentSuccess: (response: CommentIDPayload) => ({
    type: forumConstants.DELETE_PARENT_SUCCESS,
    payload: response,
  }),
  deleteParentFailure: (error: string) => ({
    type: forumConstants.DELETE_PARENT_FAILURE,
    payload: error,
  }),
  deleteParent: (payload: DeleteCommentPayload) => async (
    dispatch: Dispatch
  ) => {
    const { commentID } = payload;
    dispatch(forumActions.deleteParentPending(commentID));
    try {
      await forumAPI.deleteComment(commentID);
      dispatch(forumActions.deleteParentSuccess({ commentID }));
    } catch (error) {
      dispatch(forumActions.deleteParentFailure(error.message));
    }
  },
  deleteChildPending: (commentID: string) => ({
    type: forumConstants.DELETE_CHILD_PENDING,
    payload: commentID,
  }),
  deleteChildSuccess: (response: DeleteCommentPayload) => ({
    type: forumConstants.DELETE_CHILD_SUCCESS,
    payload: response,
  }),
  deleteChildFailure: (error: string) => ({
    type: forumConstants.DELETE_CHILD_FAILURE,
    payload: error,
  }),
  deleteChild: (payload: DeleteCommentPayload) => async (
    dispatch: Dispatch
  ) => {
    const { commentID, parentID } = payload;
    dispatch(forumActions.deleteChildPending(commentID));
    try {
      await forumAPI.deleteComment(commentID, parentID!);
      dispatch(forumActions.deleteChildSuccess(payload));
    } catch (error) {
      dispatch(forumActions.deleteChildFailure(error.message));
    }
  },
  upvoteParentPending: (commentID: string) => ({
    type: forumConstants.UPVOTE_PARENT_PENDING,
    payload: commentID,
  }),
  upvoteParentSuccess: (response: CommentIDPayload) => ({
    type: forumConstants.UPVOTE_PARENT_SUCCESS,
    payload: response,
  }),
  upvoteParentFailure: (error: string) => ({
    type: forumConstants.UPVOTE_PARENT_FAILURE,
    payload: error,
  }),
  upvoteParent: (payload: CommentIDPayload): any => async (
    dispatch: Dispatch
  ) => {
    const { commentID } = payload;
    dispatch(forumActions.upvoteParentPending(commentID));
    try {
      await forumAPI.upvoteComment(commentID);
      dispatch(forumActions.upvoteParentSuccess({ commentID }));
    } catch (error) {
      dispatch(forumActions.upvoteParentFailure(error.message));
    }
  },
  upvoteChildPending: (commentID: string) => ({
    type: forumConstants.UPVOTE_CHILD_PENDING,
    payload: commentID,
  }),
  upvoteChildSuccess: (response: CommentIDPayload) => ({
    type: forumConstants.UPVOTE_CHILD_SUCCESS,
    payload: response,
  }),
  upvoteChildFailure: (error: string) => ({
    type: forumConstants.UPVOTE_CHILD_FAILURE,
    payload: error,
  }),
  upvoteChild: (payload: CommentIDPayload): any => async (
    dispatch: Dispatch
  ) => {
    const { commentID, parentID } = payload;
    dispatch(forumActions.upvoteChildPending(commentID));
    try {
      await forumAPI.upvoteComment(parentID!, commentID);
      dispatch(forumActions.upvoteChildSuccess(payload));
    } catch (error) {
      dispatch(forumActions.upvoteChildFailure(error.message));
    }
  },
  downvoteParentPending: (commentID: string) => ({
    type: forumConstants.DOWNVOTE_PARENT_PENDING,
    payload: commentID,
  }),
  downvoteParentSuccess: (response: CommentIDPayload) => ({
    type: forumConstants.DOWNVOTE_PARENT_SUCCESS,
    payload: response,
  }),
  downvoteParentFailure: (error: string) => ({
    type: forumConstants.DOWNVOTE_PARENT_FAILURE,
    payload: error,
  }),
  downvoteParent: (payload: CommentIDPayload): any => async (
    dispatch: Dispatch
  ) => {
    const { commentID } = payload;
    dispatch(forumActions.downvoteParentPending(commentID));
    try {
      await forumAPI.downvoteComment(commentID);
      dispatch(forumActions.downvoteParentSuccess({ commentID }));
    } catch (error) {
      dispatch(forumActions.downvoteParentFailure(error.message));
    }
  },
  downvoteChildPending: (commentID: string) => ({
    type: forumConstants.DOWNVOTE_CHILD_PENDING,
    payload: commentID,
  }),
  downvoteChildSuccess: (response: CommentIDPayload) => ({
    type: forumConstants.DOWNVOTE_CHILD_SUCCESS,
    payload: response,
  }),
  downvoteChildFailure: (error: string) => ({
    type: forumConstants.DOWNVOTE_CHILD_FAILURE,
    payload: error,
  }),
  downvoteChild: (payload: CommentIDPayload): any => async (
    dispatch: Dispatch
  ) => {
    const { commentID, parentID } = payload;
    dispatch(forumActions.downvoteChildPending(commentID));
    try {
      await forumAPI.downvoteComment(commentID, parentID!);
      dispatch(forumActions.downvoteChildSuccess(payload));
    } catch (error) {
      dispatch(forumActions.downvoteChildFailure(error.message));
    }
  },
  removeUpvoteParentPending: (commentID: string) => ({
    type: forumConstants.REMOVE_UPVOTE_PARENT_PENDING,
    payload: commentID,
  }),
  removeUpvoteParentSuccess: (response: CommentIDPayload) => ({
    type: forumConstants.REMOVE_UPVOTE_PARENT_SUCCESS,
    payload: response,
  }),
  removeUpvoteParentFailure: (error: string) => ({
    type: forumConstants.REMOVE_UPVOTE_PARENT_FAILURE,
    payload: error,
  }),
  removeUpvoteParent: (payload: CommentIDPayload): any => async (
    dispatch: Dispatch
  ) => {
    const { commentID } = payload;
    dispatch(forumActions.removeUpvoteParentPending(commentID));
    try {
      await forumAPI.upvoteComment(commentID, undefined, true);
      dispatch(forumActions.removeUpvoteParentSuccess({ commentID }));
    } catch (error) {
      dispatch(forumActions.removeUpvoteParentFailure(error.message));
    }
  },
  removeUpvoteChildPending: (commentID: string) => ({
    type: forumConstants.REMOVE_UPVOTE_CHILD_PENDING,
    payload: commentID,
  }),
  removeUpvoteChildSuccess: (response: CommentIDPayload) => ({
    type: forumConstants.REMOVE_UPVOTE_CHILD_SUCCESS,
    payload: response,
  }),
  removeUpvoteChildFailure: (error: string) => ({
    type: forumConstants.REMOVE_UPVOTE_CHILD_FAILURE,
    payload: error,
  }),
  removeUpvoteChild: (payload: CommentIDPayload): any => async (
    dispatch: Dispatch
  ) => {
    const { commentID, parentID } = payload;
    dispatch(forumActions.removeUpvoteChildPending(commentID));
    try {
      await forumAPI.upvoteComment(commentID, parentID!, true);
      dispatch(forumActions.removeUpvoteChildSuccess(payload));
    } catch (error) {
      dispatch(forumActions.removeUpvoteChildFailure(error.message));
    }
  },
  removeDownvoteParentPending: (commentID: string) => ({
    type: forumConstants.REMOVE_DOWNVOTE_PARENT_PENDING,
    payload: commentID,
  }),
  removeDownvoteParentSuccess: (response: CommentIDPayload) => ({
    type: forumConstants.REMOVE_DOWNVOTE_PARENT_SUCCESS,
    payload: response,
  }),
  removeDownvoteParentFailure: (error: string) => ({
    type: forumConstants.REMOVE_DOWNVOTE_PARENT_FAILURE,
    payload: error,
  }),
  removeDownvoteParent: (payload: CommentIDPayload): any => async (
    dispatch: Dispatch
  ) => {
    const { commentID } = payload;
    dispatch(forumActions.removeDownvoteParentPending(commentID));
    try {
      await forumAPI.downvoteComment(commentID, undefined, true);
      dispatch(forumActions.removeDownvoteParentSuccess({ commentID }));
    } catch (error) {
      dispatch(forumActions.removeDownvoteParentFailure(error.message));
    }
  },
  removeDownvoteChildPending: (commentID: string) => ({
    type: forumConstants.REMOVE_DOWNVOTE_CHILD_PENDING,
    payload: commentID,
  }),
  removeDownvoteChildSuccess: (response: CommentIDPayload) => ({
    type: forumConstants.REMOVE_DOWNVOTE_CHILD_SUCCESS,
    payload: response,
  }),
  removeDownvoteChildFailure: (error: string) => ({
    type: forumConstants.REMOVE_DOWNVOTE_CHILD_FAILURE,
    payload: error,
  }),
  removeDownvoteChild: (payload: CommentIDPayload): any => async (
    dispatch: Dispatch
  ) => {
    const { commentID, parentID } = payload;
    dispatch(forumActions.removeDownvoteChildPending(commentID));
    try {
      await forumAPI.downvoteComment(commentID, parentID!, true);
      dispatch(forumActions.removeDownvoteChildSuccess(payload));
    } catch (error) {
      dispatch(forumActions.removeDownvoteChildFailure(error.message));
    }
  },
};

interface AddCommentPayload {
  stockTicker: string;
  timestamp: number;
  content: string;
  parentID?: string;
}

interface EditCommentPayload {
  commentID: string;
  timestamp: number;
  content: string;
  parentID?: string;
}

interface DeleteCommentPayload {
  commentID: string;
  parentID?: string;
}

interface CommentIDPayload {
  commentID: string;
  parentID?: string;
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

export default forumActions;
