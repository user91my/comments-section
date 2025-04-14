import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
//
import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./state";
import { Provider } from "react-redux";

export const serverURL = process.env.REACT_APP_SERVER_URL;

// Redux store set up to handle actions dispatched by the slices
// in reducer (i.e. form, api.reducerPath, ...).
const store = configureStore({
  reducer: {
    // Property named as "form" and it'll be used to access the
    // component's state.
    // i.e. const someValue = useSelector((state) => state.form.someValue);
    form: formReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
