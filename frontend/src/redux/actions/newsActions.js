import NewsAPI from "../../api/news";
import newsConstants from "../constants/newsConstants";

const newsActions = {
  newsPending: () => ({
    type: newsConstants.NEWS_PENDING,
  }),
  newsSuccess: (response) => ({
    type: newsConstants.NEWS_SUCCESS,
    payload: response,
  }),
  newsFailure: (error) => ({
    type: newsConstants.NEWS_FAILURE,
    payload: error,
  }),
  getGeneralNews: () => async (dispatch) => {
    dispatch(newsActions.newsPending());
    try {
      const res = await NewsAPI.getFeaturedNews();
      if (res.status === 200) {
        dispatch(newsActions.newsSuccess(res));
      } else {
        dispatch(newsActions.newsFailure(res.error));
      }
    } catch (error) {
      dispatch(newsActions.newsFailure(error.message));
    }
  },
  getNewsByStock: (stockSymbol) => async (dispatch) => {
    dispatch(newsActions.newsPending());
    try {
      const res = await NewsAPI.getNewsByStock(stockSymbol);
      if (res.status === 200) {
        dispatch(newsActions.newsSuccess(res));
      } else {
        dispatch(newsActions.newsFailure(res.error));
      }
    } catch (error) {
      dispatch(newsActions.newsFailure(error.message));
    }
  }
};

export default newsActions;