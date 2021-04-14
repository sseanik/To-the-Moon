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
      const { status, message, comment } = await forumAPI.addParent(
        stockTicker,
        timestamp,
        content
      );
      if (status === 200) {
        dispatch(forumActions.addParentSuccess(comment));
      } else {
        dispatch(forumActions.addParentFailure(message));
      }
    } catch (error) {
      dispatch(forumActions.addParentFailure(error));
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
      const { status, message, comment } = await forumAPI.addChild(
        stockTicker,
        timestamp,
        content,
        parentID
      );
      if (status === 200) {
        dispatch(forumActions.addChildSuccess(comment));
      } else {
        dispatch(forumActions.addChildFailure(message));
      }
    } catch (error) {
      dispatch(forumActions.addChildFailure(error));
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
      const { status, message, comments } = await forumAPI.getComments(
        stockTicker
      );
      if (status === 200) {
        dispatch(forumActions.getCommentsSuccess(comments));
      } else {
        dispatch(forumActions.getCommentsFailure(message));
      }
    } catch (error) {
      dispatch(forumActions.getCommentsFailure());
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
      const { status, message, comment } = await forumAPI.editParent(
        commentID,
        timestamp,
        content
      );
      if (status === 200) {
        dispatch(forumActions.editParentSuccess(comment));
      } else {
        dispatch(forumActions.editParentFailure(message));
      }
    } catch (error) {
      dispatch(forumActions.editParentFailure(error));
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
      const { status, message, comment } = await forumAPI.editChild(
        commentID,
        timestamp,
        content,
        parentID
      );
      if (status === 200) {
        dispatch(forumActions.editChildSuccess(comment));
      } else {
        dispatch(forumActions.editChildFailure(message));
      }
    } catch (error) {
      dispatch(forumActions.editChildFailure(error));
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
      const { status, message } = await forumAPI.deleteParent(commentID);
      if (status === 200) {
        dispatch(forumActions.deleteParentSuccess(commentID));
      } else {
        dispatch(forumActions.deleteParentFailure(message));
      }
    } catch (error) {
      dispatch(forumActions.deleteParentFailure(error));
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
      const { status, message } = await forumAPI.deleteChild(
        commentID,
        parentID
      );
      if (status === 200) {
        dispatch(forumActions.deleteChildSuccess(payload));
      } else {
        dispatch(forumActions.deleteChildFailure(message));
      }
    } catch (error) {
      dispatch(forumActions.deleteChildFailure(error));
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
