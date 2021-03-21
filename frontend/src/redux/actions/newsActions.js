import NewsAPI from "../../api/news";
import newsConstants from "../constants/newsConstants";

const newsActions = {
  newsPending: () => ({
    type: newsConstants. NEWS_PENDING,
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
      dispatch(newsActions.newsSuccess);
    } catch (error) {

    }
  }
};

export default userActions;