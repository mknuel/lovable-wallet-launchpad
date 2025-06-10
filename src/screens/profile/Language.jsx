
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/layout/MainHeader";
import Navigation from "../../components/layout/Navigation";
import { useLanguage, LANGUAGES } from "../../context/LanguageContext";
import { PATH_SETTING } from "../../context/paths";
import { languageOptions } from "../../utils/constants";
import { useTranslation } from "../../hooks/useTranslation";
import CommonButton from "../../components/Buttons/CommonButton";
import "./onboarding.css";

const LanguageScreen = () => {
  const navigate = useNavigate();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  // Update selected language when currentLanguage changes
  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update the language in the context
    changeLanguage(selectedLanguage);
    setIsLoading(false);
    navigate(PATH_SETTING);
  };

  console.log(selectedLanguage);
  return (
    <div className="container bg-white dark:bg-[#1a1a1a]">
      <Header title={t("language.title") || "Language"}></Header>
      <div className="body-container w-full h-[calc(100vh-300px)] pb-[38px] px-[8px] overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {languageOptions.map((lang, index) => (
          <div key={lang.code}>
            <div
              className="gender-option dark:bg-[#222222] dark:border-[#222222] bg-white border border-gray-200"
              onClick={() => handleLanguageChange(lang.code)}
            >
              <label className="gender-label dark:text-white text-black">{lang.label}</label>
              <div className="radio-wrapper">
                <input
                  type="radio"
                  id={lang.code}
                  name="language"
                  checked={selectedLanguage === lang.code}
                  onChange={() => {}}
                  className="gender-radio"
                />
                <span
                  className={`radio-custom ${
                    selectedLanguage === lang.code ? "selected" : ""
                  }`}
                ></span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
        </div>
      )}
      
      <CommonButton
        width="310px"
        height="42px"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "..." : (t("language.submit") || "Submit")}
      </CommonButton>
      <Navigation nav="Profile"></Navigation>
    </div>
  );
};

export default LanguageScreen;
