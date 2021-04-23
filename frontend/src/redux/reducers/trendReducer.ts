import { Action } from "redux";
import trendConstants from "../constants/trendConstants";

const trendReducer = (
  state = {
    loading: false,
    error: null,
    data: [],
  },
  action: TrendAction
) => {
  switch (action.type) {
    case trendConstants.TRENDING_INVESTMENTS_PENDING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case trendConstants.TRENDING_INVESTMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data,
      };
    case trendConstants.TRENDING_INVESTMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

interface StockCount {
  stock: string;
  count: number;
}

interface TrendAction extends Action {
  payload: {
    data: StockCount[];
  };
}

export default trendReducer;
