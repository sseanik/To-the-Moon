import screenerConstants from "../constants/screenerConstants";
import ScreenerAPI from "../../api/screener";
import { Dispatch } from "redux";
import { ScreenerQuery } from "../../helpers/ScreenerQuery";

const screenerActions = {
  saveScreenerPending: () => ({
    type: screenerConstants.SAVE_SCREENER_PENDING,
  }),
  saveScreenerSuccess: (response: any) => ({
    type: screenerConstants.SAVE_SCREENER_SUCCESS,
    payload: response,
  }),
  saveScreenerFailure: (error: string) => ({
    type: screenerConstants.SAVE_SCREENER_FAILURE,
    payload: error,
  }),

  getScreenerResultsPending: () => ({
    type: screenerConstants.GET_SCREENER_RESULTS_PENDING,
  }),
  getScreenerResultsSuccess: (response: any) => ({
    type: screenerConstants.GET_SCREENER_RESULTS_SUCCESS,
    payload: response,
  }),
  getScreenerResultsFailure: (error: string) => ({
    type: screenerConstants.GET_SCREENER_RESULTS_FAILURE,
    payload: error,
  }),

  loadScreenersPending: () => ({
    type: screenerConstants.LOAD_SCREENERS_PENDING,
  }),
  loadScreenersSuccess: (response: any) => ({
    type: screenerConstants.LOAD_SCREENERS_SUCCESS,
    payload: response,
  }),
  loadScreenersFailure: (error: string) => ({
    type: screenerConstants.LOAD_SCREENERS_FAILURE,
    payload: error,
  }),

  deleteScreenerPending: (name: string) => ({
    type: screenerConstants.DELETE_SCREENER_PENDING,
    payload: name,
  }),
  deleteScreenerSuccess: (response: any) => ({
    type: screenerConstants.DELETE_SCREENER_SUCCESS,
    payload: response,
  }),
  deleteScreenerFailure: (error: string) => ({
    type: screenerConstants.DELETE_SCREENER_FAILURE,
    payload: error,
  }),

  saveScreener: (payload: NameParamsPayload) => {
    return async (dispatch: Dispatch) => {
      dispatch(screenerActions.saveScreenerPending());
      try {
        const { name, parameters } = payload;
        const res = await ScreenerAPI.save(name, parameters);
        dispatch(screenerActions.saveScreenerSuccess(res));
        dispatch(screenerActions.loadScreeners());
      } catch (error) {
        dispatch(screenerActions.saveScreenerFailure(error.message));
      }
    };
  },

  getScreenerResults: (payload: ParameterPayload) => {
    return async (dispatch: Dispatch) => {
      dispatch(screenerActions.getScreenerResultsPending());
      try {
        const { parameters } = payload;
        const res = await ScreenerAPI.getData(parameters);
        dispatch(screenerActions.getScreenerResultsSuccess(res));
      } catch (error) {
        dispatch(screenerActions.getScreenerResultsFailure(error.message));
      }
    };
  },

  loadScreeners: (): any => {
    return async (dispatch: Dispatch) => {
      dispatch(screenerActions.loadScreenersPending());
      try {
        const res = await ScreenerAPI.load();
        dispatch(screenerActions.loadScreenersSuccess(res));
      } catch (error) {
        dispatch(screenerActions.loadScreenersFailure(error.message));
      }
    };
  },

  deleteScreener: (payload: NamePayload) => {
    return async (dispatch: Dispatch) => {
      const { name } = payload;
      dispatch(screenerActions.deleteScreenerPending(name));
      try {
        const res = await ScreenerAPI.delete(name);
        dispatch(screenerActions.deleteScreenerSuccess(res));
        dispatch(screenerActions.loadScreeners());
      } catch (error) {
        dispatch(screenerActions.deleteScreenerFailure(error.message));
      }
    };
  },

  // Extra method for delete
};

interface ParameterPayload {
  parameters: string;
}

interface NamePayload {
  name: string;
}

interface NameParamsPayload {
  name: string;
  parameters: ScreenerQuery;
}

export default screenerActions;
