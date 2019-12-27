import React from "react";
import { hot } from "react-hot-loader/root";
// Redux
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
// import logger from "redux-logger";
import ReactTooltip from "react-tooltip";
import reducers from "../reducers";
// Components
import Main from "./Main";

const stateTransformer = state => {
  return state.toJS();
};

const logger = createLogger({
  stateTransformer,
  diff: true,
  level: {
    prevState: () => null,
    action: () => "log",
    error: () => "error",
    nextState: () => null
  }
});

const store = createStore(reducers, applyMiddleware(logger));
// const store = createStore(reducers);

store.subscribe(() => {
  ReactTooltip.rebuild();
});

const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

export default hot(App);
