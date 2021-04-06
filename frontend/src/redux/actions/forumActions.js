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
};

export default forumActions;
