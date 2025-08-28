
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import userReducer from './reducers/userSlice';
import walletReducer from './reducers/walletSlice';
import settingsReducer from './reducers/settingSlice';
import authMiddleware from './middleware/authMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    wallet: walletReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(authMiddleware),
});

export default store;
