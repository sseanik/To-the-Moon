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
      const { data, error } = await watchlistAPI.getWatchlists();
      console.log(data);
      dispatch(watchlistActions.getWatchlistsSuccess(data));
    } catch (error) {
      dispatch(watchlistActions.getWatchlistsFailure(error.message));
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
      const { error } = await watchlistAPI.addWatchlist(
        portfolioName,
        description
      );
      dispatch(watchlistActions.addWatchlistSuccess());
    } catch (error) {
      dispatch(watchlistActions.addWatchlistFailure(error.message));
    }
  },
  deleteWatchlistPending: (payload: any) => ({
    type: watchlistConstants.DELETE_WATCHLIST_PENDING,
    payload,
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
    const { watchlistID } = payload;
    dispatch(watchlistActions.deleteWatchlistPending(watchlistID));
    try {
      const { error } = await watchlistAPI.deleteWatchlist(watchlistID);
      dispatch(watchlistActions.deleteWatchlistSuccess(watchlistID));
    } catch (error) {
      dispatch(watchlistActions.deleteWatchlistFailure(error.message));
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
      const { data, error } = await watchlistAPI.getFollowing();
      dispatch(watchlistActions.getFollowingSuccess(data));
    } catch (error) {
      dispatch(watchlistActions.getFollowingFailure(error.message));
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
      const { watchlistID } = payload;
      const { error } = await watchlistAPI.addFollowing(watchlistID);
      dispatch(watchlistActions.addFollowingSuccess(watchlistID));
    } catch (error) {
      dispatch(watchlistActions.addFollowingFailure(error.message));
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
      const { watchlistID } = payload;
      const { error } = await watchlistAPI.deleteFollowing(watchlistID);
      dispatch(watchlistActions.deleteFollowingSuccess(watchlistID));
    } catch (error) {
      dispatch(watchlistActions.deleteFollowingFailure(error.message));
    }
  },
  getWatchlistPending: () => ({
    type: watchlistConstants.GET_WATCHLIST_PENDING,
  }),
  getWatchlistSuccess: (payload: any) => ({
    type: watchlistConstants.GET_WATCHLIST_SUCCESS,
    payload,
  }),
  getWatchlistFailure: (payload: any) => ({
    type: watchlistConstants.GET_WATCHLIST_FAILURE,
    payload,
  }),
  getWatchlist: (payload: any) => async (dispatch: Dispatch) => {
    dispatch(watchlistActions.getWatchlistPending());
    try {
      const { watchlistID } = payload;
      const { message, data } = await watchlistAPI.getWatchlist(
        watchlistID
      );
      dispatch(watchlistActions.getWatchlistSuccess(data));
    } catch (error) {
      dispatch(watchlistActions.getWatchlistFailure(error.message));
    }
  },
};

export default watchlistActions;
