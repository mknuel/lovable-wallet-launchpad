
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  walletData: null,
  isLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setWalletData: (state, action) => {
      state.walletData = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setWalletError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearWallet: () => initialState,
  },
});

export const { setWalletLoading, setWalletData, setWalletError, clearWallet } = walletSlice.actions;
export default walletSlice.reducer;
