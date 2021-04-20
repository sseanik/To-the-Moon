import watchlistConstants from "../constants/watchlistConstants";

// should be set in another file, will be used across all reducers
interface Action {
  type: string;
  payload?: Object;
}

interface StockParams {
  stock_ticker: string;
  proportion: number;
  price: number;
  price_change_percentage: number;
  volume: number;
  market_capitalization: number;
  PE_ratio: number;
}

interface WatchlistParams {
  watchlist_id: string;
  watchlist_name: string;
  author_username: string;
  description: string;
  stocks: StockParams[];
}

// same as above
interface SimpleReduxState {
  loading: boolean;
  error: string;
}

interface MultipleDeleteReduxState {
  deleting: string[];
  error: string;
}

interface WatchlistsState extends SimpleReduxState {
  watchlists: WatchlistParams[];
}

interface FollowingState extends SimpleReduxState {
  following: string[];
}

interface WatchlistState extends SimpleReduxState {
  watchlist?: Object;
}

interface InitialState {
  getWatchlists: WatchlistsState;
  addWatchlist: SimpleReduxState;
  deleteWatchlist: MultipleDeleteReduxState;
  getFollowing: FollowingState;
  addFollowing: SimpleReduxState;
  deleteFollowing: SimpleReduxState;
  getWatchlist: WatchlistState;
}

const initialState: InitialState = {
  getWatchlists: {
    loading: false,
    error: "",
    watchlists: [],
  },
  addWatchlist: {
    loading: false,
    error: "",
  },
  deleteWatchlist: {
    deleting: [],
    error: "",
  },
  getFollowing: {
    loading: false,
    error: "",
    following: [],
  },
  addFollowing: {
    loading: false,
    error: "",
  },
  deleteFollowing: {
    loading: false,
    error: "",
  },
  getWatchlist: {
    loading: false,
    error: "",
    watchlist: {
      watchlist_id: "",
      watchlist_name: "",
      author_username: "",
      description: "",
      stocks: [],
    },
  },
};

const watchlistReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case watchlistConstants.GET_WATCHLISTS_PENDING:
      return {
        ...state,
        getWatchlists: {
          ...state.getWatchlists,
          loading: true,
          error: "",
        },
      };
    case watchlistConstants.GET_WATCHLISTS_SUCCESS:
      return {
        ...state,
        getWatchlists: {
          ...state.getWatchlists,
          loading: false,
          error: "",
          watchlists: action.payload,
        },
      };
    case watchlistConstants.GET_WATCHLISTS_FAILURE:
      return {
        ...state,
        getWatchlists: {
          ...state.getWatchlists,
          loading: false,
          error: action.payload,
          watchlists: [],
        },
      };
    case watchlistConstants.ADD_WATCHLIST_PENDING:
      return {
        ...state,
        addWatchlist: {
          loading: true,
          error: "",
        },
      };
    case watchlistConstants.ADD_WATCHLIST_SUCCESS:
      return {
        ...state,
        addWatchlist: {
          loading: false,
          error: "",
        },
      };
    case watchlistConstants.ADD_WATCHLIST_FAILURE:
      return {
        ...state,
        addWatchlist: {
          loading: false,
          error: action.payload,
        },
      };
    case watchlistConstants.DELETE_WATCHLIST_PENDING:
      return {
        ...state,
        deleteWatchlist: {
          deleting: [...state.deleteWatchlist.deleting, action.payload],
          error: "",
        },
      };
    case watchlistConstants.DELETE_WATCHLIST_SUCCESS:
      return {
        ...state,
        deleteWatchlist: {
          deleting: state.deleteWatchlist.deleting.filter(
            (id) => id !== action.payload
          ),
          error: "",
        },
        getWatchlists: {
          loading: false,
          error: "",
          watchlists: state.getWatchlists.watchlists.filter(
            (watchlistInfo) => watchlistInfo.watchlist_id !== action.payload
          ),
        },
      };
    case watchlistConstants.DELETE_WATCHLIST_FAILURE:
      return {
        ...state,
        deleteWatchlist: {
          deleting: [],
          error: action.payload,
        },
      };
    case watchlistConstants.GET_FOLLOWING_PENDING:
      return {
        ...state,
        getFollowing: {
          loading: true,
          error: "",
        },
      };
    case watchlistConstants.GET_FOLLOWING_SUCCESS:
      return {
        ...state,
        getFollowing: {
          loading: false,
          error: "",
          following: action.payload,
        },
      };
    case watchlistConstants.GET_FOLLOWING_FAILURE:
      return {
        ...state,
        getFollowing: {
          loading: false,
          error: action.payload,
          following: [],
        },
      };
    case watchlistConstants.ADD_FOLLOWING_PENDING:
      return {
        ...state,
        addFollowing: {
          loading: true,
          error: "",
        },
      };
    case watchlistConstants.ADD_FOLLOWING_SUCCESS:
      return {
        ...state,
        addFollowing: {
          loading: false,
          error: "",
        },
        getFollowing: {
          loading: false,
          error: "",
          following: [...state.getFollowing.following, action.payload],
        },
      };
    case watchlistConstants.ADD_FOLLOWING_FAILURE:
      return {
        ...state,
        addFollowing: {
          loading: false,
          error: action.payload,
        },
      };
    case watchlistConstants.DELETE_FOLLOWING_PENDING:
      return {
        ...state,
        deleteFollowing: {
          loading: true,
          error: "",
        },
      };
    case watchlistConstants.DELETE_FOLLOWING_SUCCESS:
      return {
        ...state,
        deleteFollowing: {
          loading: false,
          error: "",
        },
        getFollowing: {
          loading: false,
          error: "",
          following: state.getFollowing.following.filter(
            (id) => id !== action.payload
          ),
        },
      };
    case watchlistConstants.DELETE_FOLLOWING_FAILURE:
      return {
        ...state,
        deleteFollowing: {
          loading: false,
          error: action.payload,
        },
      };
    case watchlistConstants.GET_WATCHLIST_PENDING:
      return {
        ...state,
        getWatchlist: {
          ...state.getWatchlist,
          loading: true,
          error: "",
          watchlist: {
            ...initialState.getWatchlist.watchlist,
          },
        },
      };
    case watchlistConstants.GET_WATCHLIST_SUCCESS:
      return {
        ...state,
        getWatchlist: {
          ...state.getWatchlist,
          loading: false,
          error: "",
          watchlist: action.payload,
        },
      };
    case watchlistConstants.GET_WATCHLIST_FAILURE:
      return {
        ...state,
        getWatchlist: {
          ...state.getWatchlist,
          loading: false,
          error: action.payload,
          watchlist: {
            ...initialState.getWatchlist.watchlist,
          },
        },
      };
    default:
      return state;
  }
};

export default watchlistReducer;
