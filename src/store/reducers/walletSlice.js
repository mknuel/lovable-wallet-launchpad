
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Cache for preventing duplicate requests
let activeWalletRequest = null;
let lastWalletFetch = 0;
const CACHE_DURATION = 30000; // 30 seconds cache

// Async thunk for fetching wallet data with caching
export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check if we have fresh data in cache
      const now = Date.now();
      const state = getState();
      
      if (state.wallet.walletData && (now - lastWalletFetch) < CACHE_DURATION) {
        console.log("Using cached wallet data");
        return state.wallet.walletData;
      }

      // Prevent duplicate requests
      if (activeWalletRequest) {
        console.log("Wallet request already in progress, waiting...");
        return await activeWalletRequest;
      }

      console.log("Fetching wallet data...");
      
      activeWalletRequest = api.get('/user/wallet').then(response => {
        console.log("Wallet fetch response:", response);
        
        if (response.success || response.token !== undefined) {
          console.log("Wallet data received:", response);
          const { success, ...walletData } = response;
          console.log("Extracted wallet data:", walletData);
          lastWalletFetch = Date.now();
          return walletData;
        } else {
          throw new Error(response.message || 'Failed to fetch wallet');
        }
      }).finally(() => {
        activeWalletRequest = null;
      });

      return await activeWalletRequest;
    } catch (error) {
      console.error("Error fetching wallet:", error);
      activeWalletRequest = null;
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const initialState = {
  walletData: null,
  isLoading: false,
  error: null,
  lastFetched: 0,
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
      state.lastFetched = Date.now();
    },
    setWalletError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearWallet: () => initialState,
    invalidateWalletCache: (state) => {
      state.lastFetched = 0;
      lastWalletFetch = 0;
    },
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
        state.lastFetched = Date.now();
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        console.log("Wallet fetch rejected:", action.payload);
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selector for getting wallet data with memoization
export const selectWalletData = (state) => state.wallet.walletData;
export const selectWalletLoading = (state) => state.wallet.isLoading;
export const selectWalletError = (state) => state.wallet.error;

export const { 
  setWalletLoading, 
  setWalletData, 
  setWalletError, 
  clearWallet, 
  invalidateWalletCache 
} = walletSlice.actions;
export default walletSlice.reducer;
