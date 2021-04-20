import { Action } from "redux";
import { SimpleReduxState } from "../../types/generalTypes";
import screenerConstants from "../constants/screenerConstants";

const screenerReducer = (state = initialState, action: ScreenerAction) => {
  switch (action.type) {
    // Save screener and associated params
    // Note: params are not returned in the endpoint or in the dispatch
    case screenerConstants.SAVE_SCREENER_PENDING:
      return {
        ...state,
        saveStatus: {
          ...state.saveStatus,
          loading: true,
          error: "",
        },
      };
    case screenerConstants.SAVE_SCREENER_SUCCESS:
      return {
        ...state,
        saveStatus: {
          ...state.saveStatus,
          loading: false,
          error: "",
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
          error: "",
        },
      };
    case screenerConstants.GET_SCREENER_RESULTS_SUCCESS:
      return {
        ...state,
        results: {
          ...state.results,
          loading: false,
          error: "",
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
          error: "",
        },
      };
    case screenerConstants.LOAD_SCREENERS_SUCCESS:
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
          error: "",
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
          error: "",
          deleting: [...state.deletion.deleting, action.payload],
        },
      };
    case screenerConstants.DELETE_SCREENER_SUCCESS:
      return {
        ...state,
        deletion: {
          ...state.deletion,
          loading: false,
          error: "",
          data: action.payload.message,
          deleting: state.deletion.deleting.filter(
            (name) => name === action.payload
          ),
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
          deleting: [],
        },
      };
    default:
      return state;
  }
};

interface ScreenerAction extends Action {
  payload: {
    data?: any;
    error?: string;
    message?: string;
  };
}

interface ParameterState extends SimpleReduxState {
  data: {
    region: string[];
    marketcap: string;
    intradayLower: number;
    intradayUpper: number;
    sector: string[];
    industry: string[];
  };
}

interface SaveStatusState extends SimpleReduxState {
  data: string;
}

interface Result {
  stock_ticker: string;
  price: number;
  price_change: number;
  price_change_percentage: number;
  volume: number;
  "market capitilization": number;
  "PE ratio": number;
}

interface ResultsState extends SimpleReduxState {
  data: Result[];
}

interface DataList {
  name: string;
  params: Object;
}

interface ListState extends SimpleReduxState {
  data: DataList[];
}

interface DeletionState extends SaveStatusState {
  deleting: string[];
}

interface InitialState {
  parameters: ParameterState;
  saveStatus: SaveStatusState;
  results: ResultsState;
  list: ListState;
  deletion: DeletionState;
}

const initialState: InitialState = {
  // input parameters e.g. market cap
  parameters: {
    loading: false,
    error: "",
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
    error: "",
    data: "",
  },
  // screened stocks
  results: {
    loading: false,
    error: "",
    data: [
      // {"stock ticker": "TEST", "price": 694.20, 'price change': 2.34, 'price change percentage': 0.00619, 'volume': 2429302, 'market capitalization': 374434639073, 'PE ratio': 59.67},
    ],
  },
  // screener list
  list: {
    loading: false,
    error: "",
    data: [{ name: "E", params: {} }],
  },
  // deletion status
  deletion: {
    loading: false,
    error: "",
    data: "",
    deleting: [],
  },
};

export default screenerReducer;
