import trendConstants from "../constants/trendConstants";
import investmentAPI from "../../api/investment";
import { Dispatch } from "redux";

const trendActions = {
  getTrendingInvestmentsPending: () => ({
    type: trendConstants.TRENDING_INVESTMENTS_PENDING,
  }),
  getTrendingInvestmentsSuccess: (response: TrendingInvestmentsResponse) => ({
    type: trendConstants.TRENDING_INVESTMENTS_SUCCESS,
    payload: response,
  }),
  getTrendingInvestmentsFailure: (error: string) => ({
    type: trendConstants.TRENDING_INVESTMENTS_FAILURE,
    payload: error,
  }),
  getTrendingInvestments: (payload: TrendingInvestmentsPayload) => async (
    dispatch: Dispatch
  ) => {
    dispatch(trendActions.getTrendingInvestmentsPending());
    try {
      const { n } = payload;
      const res = await investmentAPI.getTrendingStocks(n);
      dispatch(trendActions.getTrendingInvestmentsSuccess(res));
    } catch (error) {
      dispatch(trendActions.getTrendingInvestmentsFailure(error.message));
    }
  },
};

interface TrendingInvestmentsPayload {
  n: number;
}

interface TrendingInvestmentsResponse {
  data: StockCount[];
}

interface StockCount {
  stock: string;
  count: number;
}

export default trendActions;
