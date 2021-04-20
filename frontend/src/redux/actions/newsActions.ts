import { Dispatch } from "redux";
import NewsAPI from "../../api/news";
import newsConstants from "../constants/newsConstants";

const newsActions = {
  newsPending: () => ({
    type: newsConstants.NEWS_PENDING,
  }),
  newsSuccess: (response: GeneralNewsResponse) => ({
    type: newsConstants.NEWS_SUCCESS,
    payload: response,
  }),
  newsFailure: (error: string) => ({
    type: newsConstants.NEWS_FAILURE,
    payload: error,
  }),
  getGeneralNews: () => async (dispatch: Dispatch) => {
    dispatch(newsActions.newsPending());
    try {
      const res = await NewsAPI.getFeaturedNews();
      dispatch(newsActions.newsSuccess(res));
    } catch (error) {
      dispatch(newsActions.newsFailure(error.message));
    }
  },
  getNewsByStock: (stockSymbol: string) => async (dispatch: Dispatch) => {
    dispatch(newsActions.newsPending());
    try {
      const res = await NewsAPI.getNewsByStock(stockSymbol);
      dispatch(newsActions.newsSuccess(res));
    } catch (error) {
      dispatch(newsActions.newsFailure(error.message));
    }
  },
};

interface GeneralNewsResponse {
  articles: string;
}

export default newsActions;
