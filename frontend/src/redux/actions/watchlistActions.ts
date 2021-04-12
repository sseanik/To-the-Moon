import { Dispatch } from "redux";
import watchlistAPI from "../../api/watchlist";
import watchlistConstants from "../constants/watchlistConstants";

const watchlistActions = {
  getWatchlistsPending: () => ({
    type: watchlistConstants.GET_WATCHLISTS_PENDING,
  }),
  getWatchlistsSuccess: (payload: any) => ({
    type: watchlistConstants.GET_WATCHLISTS_SUCCESS,
    payload,
  }),
  getWatchlistsFailure: (payload: any) => ({
    type: watchlistConstants.GET_WATCHLISTS_FAILURE,
    payload,
  }),
  getWatchlists: () => async (dispatch: Dispatch) => {
    dispatch(watchlistActions.getWatchlistsPending());
    try {
      const { status, watchlists, error } = await watchlistAPI.getWatchlists();
      if (status === 200) {
        dispatch(watchlistActions.getWatchlistsSuccess(watchlists));
      } else {
        dispatch(watchlistActions.getWatchlistsFailure(error));
      }
    } catch (error) {
      dispatch(watchlistActions.getWatchlistsFailure(error));
    }
  },
  addWatchlistPending: () => ({
    type: watchlistConstants.GET_WATCHLISTS_PENDING,
  }),
  addWatchlistSuccess: (payload: any) => ({
    type: watchlistConstants.GET_WATCHLISTS_SUCCESS,
    payload,
  }),
  addWatchlistFailure: (payload: any) => ({
    type: watchlistConstants.GET_WATCHLISTS_FAILURE,
    payload,
  }),
  addWatchlist: (payload: any) => async (dispatch: Dispatch) => {
    dispatch(watchlistActions.addWatchlistPending());
    try {
      const { status, watchlists, error } = await watchlistAPI.addWatchlist(
        payload
      );
      if (status === 200) {
        dispatch(watchlistActions.addWatchlistSuccess(watchlists));
      } else {
        dispatch(watchlistActions.addWatchlistFailure(error));
      }
    } catch (error) {
      dispatch(watchlistActions.addWatchlistFailure(error));
    }
  },
  getFollowingPending: () => ({
    type: watchlistConstants.GET_FOLLOWING_PENDING,
  }),
  getFollowingSuccess: (payload: any) => ({
    type: watchlistConstants.GET_FOLLOWING_SUCCESS,
    payload,
  }),
  getFollowingFailure: (payload: any) => ({
    type: watchlistConstants.GET_FOLLOWING_FAILURE,
    payload,
  }),
  getFollowing: () => async (dispatch: Dispatch) => {
    dispatch(watchlistActions.getFollowingPending());
    try {
      const { status, following, error } = await watchlistAPI.getFollowing();
      if (status === 200) {
        dispatch(watchlistActions.getFollowingSuccess(following));
      } else {
        dispatch(watchlistActions.getFollowingFailure(error));
      }
    } catch (error) {
      dispatch(watchlistActions.getFollowingFailure(error));
    }
  },
  addFollowingPending: () => ({
    type: watchlistConstants.GET_WATCHLISTS_PENDING,
  }),
  addFollowingSuccess: (payload: any) => ({
    type: watchlistConstants.GET_WATCHLISTS_SUCCESS,
    payload,
  }),
  addFollowingFailure: (payload: any) => ({
    type: watchlistConstants.GET_WATCHLISTS_FAILURE,
    payload,
  }),
  addFollowing: (payload: any) => async (dispatch: Dispatch) => {
    dispatch(watchlistActions.addFollowingPending());
    try {
      const { status, watchlists, error } = await watchlistAPI.addFollowing(
        payload
      );
      if (status === 200) {
        dispatch(watchlistActions.addFollowingSuccess(watchlists));
      } else {
        dispatch(watchlistActions.addFollowingFailure(error));
      }
    } catch (error) {
      dispatch(watchlistActions.addFollowingFailure(error));
    }
  },
};

export default watchlistActions;
