import { createSlice } from '@reduxjs/toolkit';
import { LANGUAGES } from '../../context/LanguageContext';

const initialState = {
  language: localStorage.getItem('language') || LANGUAGES.ENGLISH,
  theme: localStorage.getItem('theme') || 'light',
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
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    // other ``reducers``...
  },
});

export const { setLanguage, setTheme } = settingsSlice.actions;
export const selectLanguage = (state) => state.settings.language;
export const selectTheme = (state) => state.settings.theme;
export default settingsSlice.reducer;
