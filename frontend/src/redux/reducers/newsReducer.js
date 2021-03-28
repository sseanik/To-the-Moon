import newsConstants from "../constants/newsConstants";

export const landingNewsReducer = (state = {
  loading: false,
  data: [],
}, action) => {
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
      }
    default:
      return state;
  }
};

export const stockNewsReducer = (state = {
  loading: false,
  data: [],
}, action) => {
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
      }
    default:
      return state;
  }
};