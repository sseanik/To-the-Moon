import screenerConstants from "../constants/screenerConstants";

const initialState = {
  // input parameters e.g. market cap
  parameters: {
    loading: false,
    error: null,
    data: {
      region: [""],
      marketcap: "",
      intradayLower: 0,
      intradayUpper: 0,
      sector: [""],
      industry: [""],
    },
  },
  saveStatus: {
    loading: false,
    error: null,
    data: "",
  },
  // screened stocks
  results: {
    loading: false,
    error: null,
    data: [
      // {"stock ticker": "TEST", "price": 694.20, 'price change': 2.34, 'price change percentage': 0.00619, 'volume': 2429302, 'market capitalization': 374434639073, 'PE ratio': 59.67},
    ],
  },
  // screener list
  list: {
    loading: false,
    error: null,
    data: [
      {"name": "", "params": {}},
    ],
  },
  // deletion status
  deletion: {
    loading: false,
    error: null,
    data: "",
  }
};

const screenerReducer = (state = initialState, action) => {
  switch(action.type) {
    // Save screener and associated params
    // Note: params are not returned in the endpoint or in the dispatch
    case screenerConstants.SAVE_SCREENER_PENDING:
      return {
        ...state,
        saveStatus: {
          ...state.saveStatus,
          loading: true,
          error: null,
        },
      };
    case screenerConstants.SAVE_SCREENER_SUCCESS:
      return {
        ...state,
        saveStatus: {
          ...state.saveStatus,
          loading: false,
          error: null,
          data: action.payload,
        },
      };
    case screenerConstants.SAVE_SCREENER_FAILURE:
      return {
        ...state,
        saveStatus: {
          ...state.saveStatus,
          loading: false,
          error: action.payload,
        },
      };
    // Get list of companies using screener
    case screenerConstants.GET_SCREENER_RESULTS_PENDING:
      return {
        ...state,
        results: {
          ...state.results,
          loading: true,
          error: null,
        },
      };
    case screenerConstants.GET_SCREENER_RESULTS_SUCCESS:
      return {
        ...state,
        results: {
          ...state.results,
          loading: false,
          error: null,
          data: action.payload.data,
        },
      };
    case screenerConstants.GET_SCREENER_RESULTS_FAILURE:
      return {
        ...state,
        results: {
          ...state.results,
          loading: false,
          error: action.payload.error,
        },
      };
    // Get list of screeners registered under user
    case screenerConstants.LOAD_SCREENERS_PENDING:
      return {
        ...state,
        list: {
          ...state.list,
          loading: true,
          error: null,
        },
      };
    case screenerConstants.LOAD_SCREENERS_SUCCESS:
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
          error: null,
          data: action.payload.data,
        },
      };
    case screenerConstants.LOAD_SCREENERS_FAILURE:
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
          error: action.payload.error,
        },
      };
    // Delete screener
    // Note: no error is returned on this endpoint (yet)
    case screenerConstants.DELETE_SCREENER_PENDING:
      return {
        ...state,
        deletion: {
          ...state.deletion,
          loading: true,
          error: null,
        },
      };
    case screenerConstants.DELETE_SCREENER_SUCCESS:
      return {
        ...state,
        deletion: {
          ...state.deletion,
          loading: false,
          error: null,
          data: action.payload.message,
        },
      };
    case screenerConstants.DELETE_SCREENER_FAILURE:
      return {
        ...state,
        deletion: {
          ...state.deletion,
          loading: false,
          error: action.payload.message,
          data: "",
        },
      };
    default:
      return state;
    }
};

export default screenerReducer;
