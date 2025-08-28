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
import { useTheme } from "../../context/ThemeContext";
import "./onboarding.css";

const LanguageScreen = () => {
	const navigate = useNavigate();
	const { currentLanguage, changeLanguage } = useLanguage();
	const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
	const { t } = useTranslation();
	const { isDarkMode } = useTheme();

	// Update selected language when currentLanguage changes
	useEffect(() => {
		setSelectedLanguage(currentLanguage);
	}, [currentLanguage]);

	const handleLanguageChange = (langCode) => {
		setSelectedLanguage(langCode);
	};

	const handleSubmit = () => {
		// Update the language in the context
		changeLanguage(selectedLanguage);
		navigate(PATH_SETTING);
	};

	console.log(selectedLanguage);
	return (
		<div className={`container ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-white text-black'}`}>
			<div className="sticky top-0 left-0 w-full z-40">
				<Header title={t("language.title") || "Language"}></Header>
			</div>
			<div className="flex flex-col w-full h-[100dvh] overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-[8px] pb-[100px]">
				{languageOptions.map((lang, index) => (
					<div key={lang.code}>
						<div
							className="gender-option"
							onClick={() => handleLanguageChange(lang.code)}>
							<label className="gender-label">{lang.label}</label>
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
									}`}></span>
							</div>
						</div>
					</div>
				))}
				<div className="px-2 pb-4">
					<CommonButton
						width="100%"
						height="42px"
						onClick={handleSubmit}
						// disabled={isLoading || !termsAgreed}
					>
						{t("language.submit") || "Submit"}
					</CommonButton>
				</div>
			</div>

			<div className="sticky bottom-0 left-0 w-full z-40">
				<Navigation nav="Profile"></Navigation>
			</div>
		</div>
	);
};

export default LanguageScreen;
