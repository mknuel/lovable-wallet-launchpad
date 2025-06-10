import { createSlice } from '@reduxjs/toolkit';
import { LANGUAGES } from '../../context/LanguageContext';

const initialState = {
  language: localStorage.getItem('language') || LANGUAGES.ENGLISH,
  // other settings...
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    // other ``reducers``...
  },
});

export const { setLanguage } = settingsSlice.actions;
export const selectLanguage = (state) => state.settings.language;
export default settingsSlice.reducer;
