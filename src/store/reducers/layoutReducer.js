import { createSlice } from "@reduxjs/toolkit";

import { OPEN, HALF_OPEN, OPEN_SMALL, CLOSE } from "./../actions/types";
import { _md_size, _lg_size } from "./../../config/layoutSizes";

const handleCurrentLayoutState = () => {
  console.log("from", "handleCurrentLayoutState");

  if (window.innerWidth < _md_size) return { layoutState: CLOSE };
  if (window.innerWidth > _md_size && window.innerWidth < _lg_size)
    return { layoutState: HALF_OPEN };
  if (window.innerWidth > _lg_size) return { layoutState: OPEN };
};

// const initialState = handleCurrentLayoutState();

export const layoutSlice = createSlice({
  name: "layout",
  initialState: handleCurrentLayoutState(),
  reducers: {
    open: (state) => {
      state.layoutState = OPEN;
    },
    openHalf: (state) => {
      state.layoutState = HALF_OPEN;
    },
    openSmall: (state) => {
      state.layoutState = OPEN_SMALL;
    },
    close: (state) => {
      state.layoutState = CLOSE;
    },
  },
});

// Action creators are generated for each case reducer function
export const { open, openHalf, openSmall, close } = layoutSlice.actions;

export default layoutSlice.reducer;
