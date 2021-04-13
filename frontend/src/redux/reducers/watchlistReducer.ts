import watchlistConstants from "../constants/watchlistConstants";

// should be set in another file, will be used across all reducers
interface Action {
  type: string;
  payload?: Object;
}

// same as above
interface SimpleReduxState {
  loading: boolean;
  error: string;
}

interface WatchlistsState extends SimpleReduxState {
  watchlists: string[];
}

interface FollowingState extends SimpleReduxState {
  following: string[];
}

interface DeletingState extends SimpleReduxState {
  deleting: string[];
}

interface WatchlistState extends SimpleReduxState {
  watchlist?: Object;
}

interface InitialState {
  getWatchlists: WatchlistsState;
  addWatchlist: SimpleReduxState;
  deleteWatchlist: DeletingState;
  getFollowing: FollowingState;
  addFollowing: SimpleReduxState;
  deleteFollowing: DeletingState;
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
    loading: false,
    error: "",
    deleting: [],
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
    deleting: [],
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
          watchlists: action.payload,
        },
      };
    case watchlistConstants.GET_WATCHLISTS_FAILURE:
      return {
        ...state,
        getWatchlists: {
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
          loading: true,
          error: "",
          deleting: [...state.deleteWatchlist.deleting, action.payload],
        },
      };
    case watchlistConstants.DELETE_WATCHLIST_SUCCESS:
      return {
        ...state,
        deleteWatchlist: {
          loading: false,
          error: "",
          deleting: state.deleteWatchlist.deleting.filter(
            (name) => name !== action.payload
          ),
        },
      };
    case watchlistConstants.DELETE_WATCHLIST_FAILURE:
      return {
        ...state,
        deleteWatchlist: {
          loading: false,
          error: action.payload,
          deleting: [],
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
          deleting: [...state.deleteFollowing.deleting, action.payload],
        },
      };
    case watchlistConstants.DELETE_FOLLOWING_SUCCESS:
      return {
        ...state,
        deleteFollowing: {
          loading: false,
          error: "",
          deleting: state.deleteFollowing.deleting.filter(
            (name) => name !== action.payload
          ),
        },
      };
    case watchlistConstants.DELETE_FOLLOWING_FAILURE:
      return {
        ...state,
        deleteFollowing: {
          loading: false,
          error: action.payload,
          deleting: [],
        },
      };
    case watchlistConstants.GET_WATCHLIST_PENDING:
      return {
        ...state,
        getWatchlist: {
          loading: true,
          error: "",
          watchlist: undefined,
        },
      };
    case watchlistConstants.GET_WATCHLIST_SUCCESS:
      return {
        ...state,
        getWatchlist: {
          loading: false,
          error: "",
          watchlist: action.payload,
        },
      };
    case watchlistConstants.GET_WATCHLIST_FAILURE:
      return {
        ...state,
        getWatchlist: {
          loading: false,
          error: action.payload,
          watchlist: undefined,
        },
      };
    default:
      return state;
  }
};

export default watchlistReducer;
