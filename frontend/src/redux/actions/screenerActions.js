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

  deleteScreenerPending: () => ({
    type: screenerConstants.DELETE_SCREENER_PENDING,
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
        if (res.status === 200) {
          dispatch(screenerActions.saveScreenerSuccess(res));
        } else {
          dispatch(screenerActions.saveScreenerFailure(res.error));
        }
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
        if (res.status === 200) {
          dispatch(screenerActions.getScreenerResultsSuccess(res));
        } else {
          dispatch(screenerActions.getScreenerResultsFailure(res.error));
        }
      } catch (error) {
        dispatch(screenerActions.getScreenerResultsFailure(error.message));
      }
    }
  },

  loadScreeners: (payload) => {
    return async (dispatch) => {
      dispatch(screenerActions.loadScreenersPending());
      try {
        // const { name, parameters } = payload;
        const res = await ScreenerAPI.load();
        if (res.status === 200) {
          dispatch(screenerActions.loadScreenersSuccess(res));
        } else {
          dispatch(screenerActions.loadScreenersFailure(res.error));
        }
      } catch (error) {
        dispatch(screenerActions.loadScreenersFailure(error.message));
      }
    }
  },

  deleteScreener: (payload) => {
    return async (dispatch) => {
      dispatch(screenerActions.deleteScreenerPending());
      try {
        const { name } = payload;
        const res = await ScreenerAPI.delete(name);
        if (res.status === 200) {
          dispatch(screenerActions.deleteScreenerSuccess(res));
        } else {
          dispatch(screenerActions.deleteScreenerFailure(res.error));
        }
      } catch (error) {
        dispatch(screenerActions.deleteScreenerFailure(error.message));
      }
    }
  },

  // Extra method for delete
};

export default screenerActions;
