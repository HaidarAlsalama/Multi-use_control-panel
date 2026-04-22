import { createSlice } from "@reduxjs/toolkit";

export const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    currency: "USD",
    balance: 0,
    isBroker: 0,
    isApi: 0,
    apiToken: null
  },


  reducers: {
    setBalance: (state, action) => {
      Object.assign(state, action.payload);
    },

  },
});

// Export action creators
export const { setBalance } = balanceSlice.actions;

// Export reducer
export default balanceSlice.reducer;
