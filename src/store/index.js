import { configureStore } from "@reduxjs/toolkit";
import layoutSlice from "./reducers/layoutReducer";

const store = configureStore({
  reducer: {
    layout: layoutSlice,
  },
});

export default store;
