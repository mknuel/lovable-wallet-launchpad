import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  
  // Function to get translated text
  const t = (key) => {
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    let translation = translations[currentLanguage];
    
    // Navigate through the nested properties
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        // Fallback to English if translation not found
        let fallback = translations.en;
        for (const k of keys) {
          if (fallback && fallback[k]) {
            fallback = fallback[k];
          } else {
            return key; // Return the key if no translation found
          }
        }
        return fallback;
      }
    }
    
    return translation;
  };
  
  return { t };
};
