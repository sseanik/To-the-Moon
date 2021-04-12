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
    type: watchlistConstants.GET_FOLLOWING_FAILURE,
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
};

export default watchlistActions;
