import { Action } from "redux";
import newsConstants from "../constants/newsConstants";

export const landingNewsReducer = (
  state = {
    loading: false,
    data: [],
  },
  action: NewsAction
) => {
  switch (action.type) {
    case newsConstants.NEWS_PENDING:
      return {
        ...state,
        loading: true,
      };
    case newsConstants.NEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.articles,
      };
    case newsConstants.NEWS_FAILURE:
      return {
        ...state,
        loading: false,
        data: [],
      };
    default:
      return state;
  }
};

export const stockNewsReducer = (
  state = {
    loading: false,
    data: [],
  },
  action: NewsAction
) => {
  switch (action.type) {
    case newsConstants.NEWS_PENDING:
      return {
        ...state,
        loading: true,
      };
    case newsConstants.NEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.articles,
      };
    case newsConstants.NEWS_FAILURE:
      return {
        ...state,
        loading: false,
        data: [],
      };
    default:
      return state;
  }
};

export const stockNewsMultiReducer = (
  state = {
    loading: {},
    data: {},
    error: "",
  },
  action: NewsMultiAction
) => {
  
  switch (action.type) {
    case newsConstants.STOCK_NEWS_PENDING:
      const newLoadingPending: LoadingState = { ...state.loading };
      newLoadingPending[action.payload.stock] = true;
      return {
        ...state,
        loading: { ...newLoadingPending },
        error: "",
      };
    case newsConstants.STOCK_NEWS_SUCCESS:
      const newLoadingSuccess: LoadingState = { ...state.loading };
      newLoadingSuccess[action.payload.stock] = false;
      const newDataSuccess: MultiNewsState = { ...state.data };
      newDataSuccess[action.payload.stock] = action.payload.response.articles;
      return {
        ...state,
        loading: { ...newLoadingSuccess },
        data: { ...newDataSuccess },
      };
    case newsConstants.STOCK_NEWS_FAILURE:
      const newLoadingFailure: LoadingState = { ...state.loading };
      newLoadingFailure[action.payload.stock] = false;
      return {
        ...state,
        loading: { ...newLoadingFailure },
        error: action.payload.error,
      };
    default:
      return state;
  }
};

interface Articles {
  articles: string[];
}

interface NewsAction extends Action {
  payload: Articles;
}

interface NewsMultiAction extends Action {
  payload: {
    stock: string;
    response: Articles;
    error: string;
  };
}

interface LoadingState {
  [key: string]: boolean;
}

interface MultiNewsState {
  [key: string]: Array<string>;
}
