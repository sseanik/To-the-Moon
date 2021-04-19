import forumAPI from "../../api/forum";
import forumConstants from "../constants/forumConstants";

const forumActions = {
  addParentPending: () => ({
    type: forumConstants.ADD_PARENT_PENDING,
  }),
  addParentSuccess: (response) => ({
    type: forumConstants.ADD_PARENT_SUCCESS,
    payload: response,
  }),
  addParentFailure: (error) => ({
    type: forumConstants.ADD_PARENT_FAILURE,
    payload: error,
  }),
  addParent: (payload) => async (dispatch) => {
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
  addChildPending: (parentID) => ({
    type: forumConstants.ADD_CHILD_PENDING,
    payload: parentID,
  }),
  addChildSuccess: (response) => ({
    type: forumConstants.ADD_CHILD_SUCCESS,
    payload: response,
  }),
  addChildFailure: (error) => ({
    type: forumConstants.ADD_CHILD_FAILURE,
    payload: error,
  }),
  addChild: (payload) => async (dispatch) => {
    const { stockTicker, timestamp, content, parentID } = payload;
    dispatch(forumActions.addChildPending(parentID));
    try {
      const { comment } = await forumAPI.addChild(
        stockTicker,
        timestamp,
        content,
        parentID
      );
      dispatch(forumActions.addChildSuccess(comment));
    } catch (error) {
      dispatch(forumActions.addChildFailure(error.message));
    }
  },
  getCommentsPending: () => ({
    type: forumConstants.GET_COMMENTS_PENDING,
  }),
  getCommentsSuccess: (response) => ({
    type: forumConstants.GET_COMMENTS_SUCCESS,
    payload: response,
  }),
  getCommentsFailure: (error) => ({
    type: forumConstants.GET_COMMENTS_FAILURE,
    payload: error,
  }),
  getComments: (stockTicker) => async (dispatch) => {
    dispatch(forumActions.getCommentsPending());
    try {
      const { comments } = await forumAPI.getComments(stockTicker);
      dispatch(forumActions.getCommentsSuccess(comments));
    } catch (error) {
      dispatch(forumActions.getCommentsFailure(error.message));
    }
  },
  editParentPending: (payload) => ({
    type: forumConstants.EDIT_PARENT_PENDING,
    payload,
  }),
  editParentSuccess: (response) => ({
    type: forumConstants.EDIT_PARENT_SUCCESS,
    payload: response,
  }),
  editParentFailure: (error) => ({
    type: forumConstants.EDIT_PARENT_FAILURE,
    payload: error,
  }),
  editParent: (payload) => async (dispatch) => {
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
  editChildPending: (payload) => ({
    type: forumConstants.EDIT_CHILD_PENDING,
    payload,
  }),
  editChildSuccess: (response) => ({
    type: forumConstants.EDIT_CHILD_SUCCESS,
    payload: response,
  }),
  editChildFailure: (error) => ({
    type: forumConstants.EDIT_CHILD_FAILURE,
    payload: error,
  }),
  editChild: (payload) => async (dispatch) => {
    dispatch(forumActions.editChildPending(payload));
    try {
      const { commentID, timestamp, content, parentID } = payload;
      const { comment } = await forumAPI.editChild(
        commentID,
        timestamp,
        content,
        parentID
      );
      dispatch(forumActions.editChildSuccess(comment));
    } catch (error) {
      dispatch(forumActions.editChildFailure(error.message));
    }
  },
  deleteParentPending: (commentID) => ({
    type: forumConstants.DELETE_PARENT_PENDING,
    payload: commentID,
  }),
  deleteParentSuccess: (response) => ({
    type: forumConstants.DELETE_PARENT_SUCCESS,
    payload: response,
  }),
  deleteParentFailure: (error) => ({
    type: forumConstants.DELETE_PARENT_FAILURE,
    payload: error,
  }),
  deleteParent: (payload) => async (dispatch) => {
    const { commentID } = payload;
    dispatch(forumActions.deleteParentPending(commentID));
    try {
      await forumAPI.deleteParent(commentID);
      dispatch(forumActions.deleteParentSuccess(commentID));
    } catch (error) {
      dispatch(forumActions.deleteParentFailure(error.message));
    }
  },
  deleteChildPending: (commentID) => ({
    type: forumConstants.DELETE_CHILD_PENDING,
    payload: commentID,
  }),
  deleteChildSuccess: (response) => ({
    type: forumConstants.DELETE_CHILD_SUCCESS,
    payload: response,
  }),
  deleteChildFailure: (error) => ({
    type: forumConstants.DELETE_CHILD_FAILURE,
    payload: error,
  }),
  deleteChild: (payload) => async (dispatch) => {
    const { commentID, parentID } = payload;
    dispatch(forumActions.deleteChildPending(commentID));
    try {
      await forumAPI.deleteChild(commentID, parentID);
      dispatch(forumActions.deleteChildSuccess(payload));
    } catch (error) {
      dispatch(forumActions.deleteChildFailure(error.message));
    }
  },
  upvoteParentPending: (commentID) => ({
    type: forumConstants.UPVOTE_PARENT_PENDING,
    payload: commentID,
  }),
  upvoteParentSuccess: (response) => ({
    type: forumConstants.UPVOTE_PARENT_SUCCESS,
    payload: response,
  }),
  upvoteParentFailure: (error) => ({
    type: forumConstants.UPVOTE_PARENT_FAILURE,
    payload: error,
  }),
  upvoteParent: (payload) => async (dispatch) => {
    const { commentID } = payload;
    dispatch(forumActions.upvoteParentPending(commentID));
    try {
      dispatch(forumActions.upvoteParentSuccess(commentID));
    } catch (error) {
      dispatch(forumActions.upvoteParentFailure(error));
    }
  },
  upvoteChildPending: (commentID) => ({
    type: forumConstants.UPVOTE_CHILD_PENDING,
    payload: commentID,
  }),
  upvoteChildSuccess: (response) => ({
    type: forumConstants.UPVOTE_CHILD_SUCCESS,
    payload: response,
  }),
  upvoteChildFailure: (error) => ({
    type: forumConstants.UPVOTE_CHILD_FAILURE,
    payload: error,
  }),
  upvoteChild: (payload) => async (dispatch) => {
    const { commentID } = payload;
    dispatch(forumActions.upvoteChildPending(commentID));
    try {
      dispatch(forumActions.upvoteChildSuccess(payload));
    } catch (error) {
      dispatch(forumActions.upvoteChildFailure(error));
    }
  },
  downvoteParentPending: (commentID) => ({
    type: forumConstants.DOWNVOTE_PARENT_PENDING,
    payload: commentID,
  }),
  downvoteParentSuccess: (response) => ({
    type: forumConstants.DOWNVOTE_PARENT_SUCCESS,
    payload: response,
  }),
  downvoteParentFailure: (error) => ({
    type: forumConstants.DOWNVOTE_PARENT_FAILURE,
    payload: error,
  }),
  downvoteParent: (payload) => async (dispatch) => {
    const { commentID } = payload;
    dispatch(forumActions.downvoteParentPending(commentID));
    try {
      dispatch(forumActions.downvoteParentSuccess(commentID));
    } catch (error) {
      dispatch(forumActions.downvoteParentFailure(error));
    }
  },
  downvoteChildPending: (commentID) => ({
    type: forumConstants.DOWNVOTE_CHILD_PENDING,
    payload: commentID,
  }),
  downvoteChildSuccess: (response) => ({
    type: forumConstants.DOWNVOTE_CHILD_SUCCESS,
    payload: response,
  }),
  downvoteChildFailure: (error) => ({
    type: forumConstants.DOWNVOTE_CHILD_FAILURE,
    payload: error,
  }),
  downvoteChild: (payload) => async (dispatch) => {
    const { commentID } = payload;
    dispatch(forumActions.downvoteChildPending(commentID));
    try {
      dispatch(forumActions.downvoteChildSuccess(payload));
    } catch (error) {
      dispatch(forumActions.downvoteChildFailure(error));
    }
  },
};

export default forumActions;
