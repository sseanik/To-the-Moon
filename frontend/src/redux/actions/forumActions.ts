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
      const { comment } = await forumAPI.addParent(
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
      const { comment } = await forumAPI.addChild(
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
      const { comment } = await forumAPI.editParent(
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
      const { comment } = await forumAPI.editChild(
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
      await forumAPI.deleteParent(commentID);
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
      await forumAPI.deleteChild(commentID, parentID!);
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
  upvoteParent: (payload: CommentIDPayload) => async (dispatch: Dispatch) => {
    const { commentID } = payload;
    dispatch(forumActions.upvoteParentPending(commentID));
    try {
      dispatch(forumActions.upvoteParentSuccess({ commentID }));
      await forumAPI.upvoteParent(commentID);
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
  upvoteChild: (payload: CommentIDPayload) => async (dispatch: Dispatch) => {
    const { commentID, parentID } = payload;
    dispatch(forumActions.upvoteChildPending(commentID));
    try {
      dispatch(forumActions.upvoteChildSuccess(payload));
      await forumAPI.upvoteChild(commentID, parentID!);
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
  downvoteParent: (payload: CommentIDPayload) => async (dispatch: Dispatch) => {
    const { commentID } = payload;
    dispatch(forumActions.downvoteParentPending(commentID));
    try {
      dispatch(forumActions.downvoteParentSuccess({ commentID }));
      await forumAPI.downvoteParent(commentID);
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
  downvoteChild: (payload: CommentIDPayload) => async (dispatch: Dispatch) => {
    const { commentID, parentID } = payload;
    dispatch(forumActions.downvoteChildPending(commentID));
    try {
      dispatch(forumActions.downvoteChildSuccess(payload));
      await forumAPI.downvoteChild(commentID, parentID!);
    } catch (error) {
      dispatch(forumActions.downvoteChildFailure(error.message));
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
