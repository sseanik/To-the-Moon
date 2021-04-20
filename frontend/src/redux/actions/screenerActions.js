import screenerConstants from "../constants/screenerConstants";
import ScreenerAPI from "../../api/screener";

const screenerActions = {
  saveScreenerPending: () => ({
    type: screenerConstants.SAVE_SCREENER_PENDING,
  }),
  saveScreenerSuccess: (response) => ({
    type: screenerConstants.SAVE_SCREENER_SUCCESS,
    payload: response,
  }),
  saveScreenerFailure: (error) => ({
    type: screenerConstants.SAVE_SCREENER_FAILURE,
    payload: error,
  }),

  getScreenerResultsPending: () => ({
    type: screenerConstants.GET_SCREENER_RESULTS_PENDING,
  }),
  getScreenerResultsSuccess: (response) => ({
    type: screenerConstants.GET_SCREENER_RESULTS_SUCCESS,
    payload: response,
  }),
  getScreenerResultsFailure: (error) => ({
    type: screenerConstants.GET_SCREENER_RESULTS_FAILURE,
    payload: error,
  }),

  loadScreenersPending: () => ({
    type: screenerConstants.LOAD_SCREENERS_PENDING,
  }),
  loadScreenersSuccess: (response) => ({
    type: screenerConstants.LOAD_SCREENERS_SUCCESS,
    payload: response,
  }),
  loadScreenersFailure: (error) => ({
    type: screenerConstants.LOAD_SCREENERS_FAILURE,
    payload: error,
  }),

  deleteScreenerPending: (name) => ({
    type: screenerConstants.DELETE_SCREENER_PENDING,
    payload: name,
  }),
  deleteScreenerSuccess: (response) => ({
    type: screenerConstants.DELETE_SCREENER_SUCCESS,
    payload: response,
  }),
  deleteScreenerFailure: (error) => ({
    type: screenerConstants.DELETE_SCREENER_FAILURE,
    payload: error,
  }),

  saveScreener: (payload) => {
    return async (dispatch) => {
      dispatch(screenerActions.saveScreenerPending());
      try {
        const { name, parameters } = payload;
        const res = await ScreenerAPI.save(name, parameters);
        dispatch(screenerActions.saveScreenerSuccess(res));
        dispatch(screenerActions.loadScreeners({}));
      } catch (error) {
        dispatch(screenerActions.saveScreenerFailure(error.message));
      }
    }
  },

  getScreenerResults: (payload) => {
    return async (dispatch) => {
      dispatch(screenerActions.getScreenerResultsPending());
      try {
        const { parameters } = payload;
        const res = await ScreenerAPI.getData(parameters);
        dispatch(screenerActions.getScreenerResultsSuccess(res));
      } catch (error) {
        dispatch(screenerActions.getScreenerResultsFailure(error.message));
      }
    }
  },

  loadScreeners: (payload) => {
    return async (dispatch) => {
      dispatch(screenerActions.loadScreenersPending());
      try {
        const res = await ScreenerAPI.load();
        dispatch(screenerActions.loadScreenersSuccess(res));
      } catch (error) {
        dispatch(screenerActions.loadScreenersFailure(error.message));
      }
    }
  },

  deleteScreener: (payload) => {
    return async (dispatch) => {
      const { name } = payload;
      dispatch(screenerActions.deleteScreenerPending(name));
      try {
        const res = await ScreenerAPI.delete(name);
        dispatch(screenerActions.deleteScreenerSuccess(res));
        dispatch(screenerActions.loadScreeners({}));
      } catch (error) {
        dispatch(screenerActions.deleteScreenerFailure(error.message));
      }
    }
  },

  // Extra method for delete
};

export default screenerActions;
