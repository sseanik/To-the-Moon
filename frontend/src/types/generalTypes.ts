import { Action } from "redux";

export interface SimpleReduxState {
  loading: boolean;
  error: string;
}

export interface PayloadAction extends Action {
  payload?: Object;
}
