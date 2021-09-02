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
  stockNewsPending: (stock: string) => ({
    type: newsConstants.STOCK_NEWS_PENDING,
    payload: { stock },
  }),
  stockNewsSuccess: (stock: string, response: GeneralNewsResponse) => ({
    type: newsConstants.STOCK_NEWS_SUCCESS,
    payload: { stock, response },
  }),
  stockNewsFailure: (stock: string, error: string) => ({
    type: newsConstants.STOCK_NEWS_FAILURE,
    payload: { stock, error },
  }),
  getGeneralNews: () => async (dispatch: Dispatch) => {
    dispatch(newsActions.newsPending());
    try {
      const res = await NewsAPI.getFeaturedNews();
      dispatch(newsActions.newsSuccess(res));
    } catch (error: any) {
      dispatch(newsActions.newsFailure(error.message));
    }
  },
  getNewsByStock: (stockSymbol: string) => async (dispatch: Dispatch) => {
    dispatch(newsActions.newsPending());
    try {
      const res = await NewsAPI.getNewsByStock(stockSymbol);
      dispatch(newsActions.newsSuccess(res));
    } catch (error: any) {
      dispatch(newsActions.newsFailure(error.message));
    }
  },
  getNewsByStockMulti: (stockSymbol: string) => async (dispatch: Dispatch) => {
    dispatch(newsActions.stockNewsPending(stockSymbol));
    try {
      const res = await NewsAPI.getNewsByStock(stockSymbol);
      dispatch(newsActions.stockNewsSuccess(stockSymbol, res));
    } catch (error: any) {
      dispatch(newsActions.stockNewsFailure(stockSymbol, error.message));
    }
  },
};

interface GeneralNewsResponse {
  articles: string;
}

export default newsActions;
