import { applyMiddleware, compose, createStore, StoreEnhancer } from "redux";
import thunkMiddleware from "redux-thunk";

import loggerMiddleware from "./middleware/logger";
import rootReducer from "./reducers/rootReducer";

// Configure and initialise the store - attach middleware and reducers here
export default function configureStore(preloadedState: any) {
  const middlewares = [loggerMiddleware, thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers: StoreEnhancer = compose(...enhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  return store;
}
