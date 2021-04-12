import watchlistConstants from "../constants/watchlistConstants";

interface Action {
  type: string;
  payload: Object;
}

interface SimpleReduxState {
  loading: boolean;
  error: string;
}

interface WatchlistState {
  getWatchlists: SimpleReduxState;
  getFollowing: SimpleReduxState;
  addFollowing: SimpleReduxState;
  deleteFollowing: SimpleReduxState;
  watchlists: string[];
  following: string[];
}

const initialState: WatchlistState = {
  getWatchlists: {
    loading: false,
    error: "",
  },
  getFollowing: {
    loading: false,
    error: "",
  },
  addFollowing: {
    loading: false,
    error: "",
  },
  deleteFollowing: {
    loading: false,
    error: "",
  },
  watchlists: [],
  following: [],
};

const watchlistReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case watchlistConstants.GET_WATCHLISTS_PENDING:
      return {
        ...state,
        getWatchlists: {
          loading: true,
          error: "",
        },
      };
    case watchlistConstants.GET_WATCHLISTS_SUCCESS:
      return {
        ...state,
        getWatchlists: {
          loading: false,
          error: "",
        },
        watchlists: action.payload,
      };
    case watchlistConstants.GET_WATCHLISTS_FAILURE:
      return {
        ...state,
        getWatchlists: {
          loading: false,
          error: action.payload,
        },
        watchlists: [],
      };
    default:
      return state;
  }
};

export default watchlistReducer;
