import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./admin/login/slices/login";
import logoutReducer from "./admin/logout/slices/logout";
import messageReducer from "./common/slices/message";
import languagesReducer from "./common/slices/languages";

const reducer = {
  login: loginReducer,
  logout: logoutReducer,
  message: messageReducer,
  langs: languagesReducer
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
