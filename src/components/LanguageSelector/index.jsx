/* eslint-disable no-unused-vars */
import React from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { useLanguage } from "../../context/LanguageContext";
import { languageOptions } from "../../utils/constants";
// import { WholeWord, WorkflowIcon } from "lucide-react";
import { IconLanguage } from "../../assets";
import "./language.css";

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const { LANGUAGES } = useLanguage();
  const { t } = useTranslation();
  
  return (
    <div className="language-dropdown-container">
      <IconLanguage />
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="language-select"
      >
        {languageOptions.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
