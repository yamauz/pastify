import React from "react";
import { hot } from "react-hot-loader/root";
// Redux
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "../reducers";
// Components
import Main from "./Main";

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  // console.log(store.getState());
  // console.log(
  //   store
  //     .getState()
  //     .get("itemsTimeLine")
  //     .get("@WUhtLREnA")
  //     .get("isTrashed")
  // );
  // console.log(store.getState().get("itemsFav").size);
});

const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

export default hot(App);
