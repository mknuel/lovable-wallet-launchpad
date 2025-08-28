import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderMenu from "./HeaderMenu";
import { useTheme } from "../../context/ThemeContext"; // Import the theme context

const Header = ({ title, action, className, onBack }) => {
	const navigate = useNavigate();
	const [showHeaderMenu, setShowHeaderMenu] = useState(false);
	const { isDarkMode } = useTheme(); // Use the theme context

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			navigate(-1);
		}
	};

	const handleMenuToggle = () => {
		setShowHeaderMenu(!showHeaderMenu);
	};

	const handleCloseMenu = () => {
		setShowHeaderMenu(false);
	};

	// Dynamic classes based on theme
	const headerClasses = `w-full sticky top-0 left-0 right-0 z-40 shadow-md ${
		isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
	} ${className || ""}`;

	const backButtonClasses = `p-2 rounded-md transition-colors mr-2 ${
		isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
	}`;

	const menuButtonClasses = `p-1 rounded-md transition-colors ${
		isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
	}`;

	const titleClasses = `text-[18px] font-['Sansation'] font-bold absolute left-1/2 transform -translate-x-1/2 ${
		isDarkMode ? "text-white" : "text-[#1D2126]"
	}`;

	const arrowColor = isDarkMode ? "#E0E0E0" : "#666666";
	const menuIconFill = isDarkMode ? "#E0E0E0" : "#666666";

	return (
		<>
			<div className={headerClasses}>
				<div className="flex items-center justify-between px-4 py-4 relative">
					<div className="flex items-center">
						{action && (
							<button
								onClick={handleBack}
								className={backButtonClasses}
								aria-label="Go back">
								<ArrowLeft
									size={20}
									className={`transition-colors`}
									style={{ color: arrowColor }}
								/>
							</button>
						)}
					</div>

					<h1 className={titleClasses}>{title}</h1>

					<button
						onClick={handleMenuToggle}
						className={menuButtonClasses}
						aria-label="Open menu">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
								fill={menuIconFill}
							/>
						</svg>
					</button>
				</div>
			</div>
			<HeaderMenu isOpen={showHeaderMenu} onClose={handleCloseMenu} />
		</>
	);
};

export default Header;
