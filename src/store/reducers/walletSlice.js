
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Async thunk for fetching wallet data
export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching wallet data...");
      const response = await api.get('/user/wallet');
      console.log("Wallet fetch response:", response);
      
      // The response structure shows data is directly in response, not response.data
      if (response.success || response.token !== undefined) {
        console.log("Wallet data received:", response);
        return response; // Return the response directly since it contains the wallet data
      } else {
        return rejectWithValue(response.message || 'Failed to fetch wallet');
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        console.log("Wallet fetch pending...");
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        console.log("Wallet fetch fulfilled with data:", action.payload);
        state.isLoading = false;
        state.walletData = action.payload;
        state.error = null;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        console.log("Wallet fetch rejected:", action.payload);
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setWalletLoading, setWalletData, setWalletError, clearWallet } = walletSlice.actions;
export default walletSlice.reducer;
