import React from "react";
import { hot } from "react-hot-loader/root";
// Redux
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import reducers from "../reducers";
// Components
import Main from "./Main";

import ReactTooltip from "react-tooltip";

const store = createStore(reducers, applyMiddleware(logger));

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
