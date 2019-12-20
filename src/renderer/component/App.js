import React from "react";
import { hot } from "react-hot-loader/root";
// Redux
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "../reducers";
// Components
import Main from "./Main";

import ReactTooltip from "react-tooltip";

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

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
