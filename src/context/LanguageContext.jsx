/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define supported languages
export const LANGUAGES = {
  ENGLISH: 'en',
  FRENCH: 'fr',
  SPANISH: 'es',
  PORTUGUESE: 'pt',
  CHINESE: 'zh',
  JAPANESE: 'ja',
  ARABIC: 'ar',
  TURKISH: 'tr',
  PERSIAN: 'fa',
  BENGALI: 'bn',
  HINDI: 'hi',
  INDONESIAN: 'id'
};

// Create the language context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Get language from localStorage or default to English
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('language') || LANGUAGES.ENGLISH
  );

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  // Function to change the language
  const changeLanguage = (language) => {
    setCurrentLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
