import trendConstants from "../constants/trendConstants";
import investmentAPI from "../../api/investment";

const trendActions = {
  getTrendingInvestmentsPending: () => ({
    type: trendConstants.TRENDING_INVESTMENTS_PENDING,
  }),
  getTrendingInvestmentsSuccess: (response) => ({
    type: trendConstants.TRENDING_INVESTMENTS_SUCCESS,
    payload: response,
  }),
  getTrendingInvestmentsFailure: (error) => ({
    type: trendConstants.TRENDING_INVESTMENTS_FAILURE,
    payload: error,
  }),
  getTrendingInvestments: (payload) => async (dispatch) => {
    dispatch(trendActions.getTrendingInvestmentsPending());
    try {
      const { n } = payload
      const res = await investmentAPI.getTrendingStocks(n);
      dispatch(trendActions.getTrendingInvestmentsSuccess(res));
    } catch (error) {
      dispatch(trendActions.getTrendingInvestmentsFailure(error.message));
    }
  }
};

export default trendActions;