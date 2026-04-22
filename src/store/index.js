import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authReducer";
import balanceSlice from "./reducers/balanceReducer";
import layoutSlice from "./reducers/layoutReducer";

const store = configureStore({
  reducer: {
    layout: layoutSlice,
    auth: authSlice,
    balance: balanceSlice,
  },
});

export default store;
