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
      const { status, data, error } = await watchlistAPI.getWatchlists();
      console.log(data);
      if (status === 200) {
        dispatch(watchlistActions.getWatchlistsSuccess(data));
      } else {
        dispatch(watchlistActions.getWatchlistsFailure(error));
      }
    } catch (error) {
      dispatch(watchlistActions.getWatchlistsFailure(error));
    }
  },
  addWatchlistPending: () => ({
    type: watchlistConstants.ADD_WATCHLIST_PENDING,
  }),
  addWatchlistSuccess: () => ({
    type: watchlistConstants.ADD_WATCHLIST_SUCCESS,
  }),
  addWatchlistFailure: (payload: any) => ({
    type: watchlistConstants.ADD_WATCHLIST_FAILURE,
    payload,
  }),
  addWatchlist: (payload: any) => async (dispatch: Dispatch) => {
    dispatch(watchlistActions.addWatchlistPending());
    try {
      const { portfolioName, description } = payload;
      const { status, error } = await watchlistAPI.addWatchlist(
        portfolioName,
        description
      );
      if (status === 200) {
        dispatch(watchlistActions.addWatchlistSuccess());
      } else {
        dispatch(watchlistActions.addWatchlistFailure(error));
      }
    } catch (error) {
      dispatch(watchlistActions.addWatchlistFailure(error));
    }
  },
  deleteWatchlistPending: () => ({
    type: watchlistConstants.DELETE_WATCHLIST_PENDING,
  }),
  deleteWatchlistSuccess: (payload: any) => ({
    type: watchlistConstants.DELETE_WATCHLIST_SUCCESS,
    payload,
  }),
  deleteWatchlistFailure: (payload: any) => ({
    type: watchlistConstants.DELETE_WATCHLIST_FAILURE,
    payload,
  }),
  deleteWatchlist: (payload: any) => async (dispatch: Dispatch) => {
    dispatch(watchlistActions.deleteWatchlistPending());
    try {
      const { status, watchlists, error } = await watchlistAPI.deleteWatchlist(
        payload
      );
      if (status === 200) {
        dispatch(watchlistActions.deleteWatchlistSuccess(watchlists));
      } else {
        dispatch(watchlistActions.deleteWatchlistFailure(error));
      }
    } catch (error) {
      dispatch(watchlistActions.deleteWatchlistFailure(error));
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
    type: watchlistConstants.ADD_FOLLOWING_PENDING,
  }),
  addFollowingSuccess: (payload: any) => ({
    type: watchlistConstants.ADD_FOLLOWING_SUCCESS,
    payload,
  }),
  addFollowingFailure: (payload: any) => ({
    type: watchlistConstants.ADD_FOLLOWING_FAILURE,
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
  deleteFollowingPending: () => ({
    type: watchlistConstants.DELETE_FOLLOWING_PENDING,
  }),
  deleteFollowingSuccess: (payload: any) => ({
    type: watchlistConstants.DELETE_FOLLOWING_SUCCESS,
    payload,
  }),
  deleteFollowingFailure: (payload: any) => ({
    type: watchlistConstants.DELETE_FOLLOWING_FAILURE,
    payload,
  }),
  deleteFollowing: (payload: any) => async (dispatch: Dispatch) => {
    dispatch(watchlistActions.deleteFollowingPending());
    try {
      const { status, watchlists, error } = await watchlistAPI.deleteFollowing(
        payload
      );
      if (status === 200) {
        dispatch(watchlistActions.deleteFollowingSuccess(watchlists));
      } else {
        dispatch(watchlistActions.deleteFollowingFailure(error));
      }
    } catch (error) {
      dispatch(watchlistActions.deleteFollowingFailure(error));
    }
  },
};

export default watchlistActions;
