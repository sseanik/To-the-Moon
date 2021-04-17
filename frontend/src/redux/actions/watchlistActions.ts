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
      const { data } = await watchlistAPI.getWatchlists();
      console.log(data);
      dispatch(watchlistActions.getWatchlistsSuccess(data));
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
      await watchlistAPI.addWatchlist(portfolioName, description);
      dispatch(watchlistActions.addWatchlistSuccess());
    } catch (error) {
      dispatch(watchlistActions.addWatchlistFailure(error));
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
      await watchlistAPI.deleteWatchlist(watchlistID);
      dispatch(watchlistActions.deleteWatchlistSuccess(watchlistID));
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
      const { data } = await watchlistAPI.getFollowing();
      dispatch(watchlistActions.getFollowingSuccess(data));
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
      const { watchlistID } = payload;
      await watchlistAPI.addFollowing(watchlistID);
      dispatch(watchlistActions.addFollowingSuccess(watchlistID));
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
      const { watchlistID } = payload;
      await watchlistAPI.deleteFollowing(watchlistID);
      dispatch(watchlistActions.deleteFollowingSuccess(watchlistID));
    } catch (error) {
      dispatch(watchlistActions.deleteFollowingFailure(error));
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
      const { data } = await watchlistAPI.getWatchlist(watchlistID);
      dispatch(watchlistActions.getWatchlistSuccess(data));
    } catch (error) {
      dispatch(watchlistActions.getWatchlistFailure(error.message));
    }
  },
};

export default watchlistActions;
