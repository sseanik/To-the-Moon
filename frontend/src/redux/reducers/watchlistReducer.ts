import watchlistConstants from "../constants/watchlistConstants";

interface Action {
  type: string;
  payload: Object;
}

interface SimpleReduxState {
  loading: boolean;
  error: string;
}

interface WatchlistState extends SimpleReduxState {
  watchlists: string[];
}

interface FollowingState extends SimpleReduxState {
  following: string[];
}

interface InitialState {
  getWatchlists: WatchlistState;
  getFollowing: FollowingState;
  addFollowing: SimpleReduxState;
  deleteFollowing: SimpleReduxState;
}

const initialState: InitialState = {
  getWatchlists: {
    loading: false,
    error: "",
    watchlists: [],
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
    default:
      return state;
  }
};

export default watchlistReducer;
