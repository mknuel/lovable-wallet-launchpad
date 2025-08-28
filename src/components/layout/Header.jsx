import React from "react";
import { Bell } from "lucide-react";
import LogoHorizontal from "../../assets/images/Logo_Bloackloans_Horizontal.png";
import { useTheme } from "../../context/ThemeContext"; // Import the theme context

export const Header = ({
	onMenuClick,
	onNotificationClick,
	onSettingsClick,
	className,
}) => {
	const { isDarkMode } = useTheme(); // Use the theme context

	// Dynamic classes based on theme
	const navClasses = `w-full items-center flex justify-between pl-5 pr-4 py-4 ${
		isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
	} ${className || ""}`;

	const buttonClasses = `p-1 rounded-md transition-colors ${
		isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
	}`;

	return (
		<nav className={navClasses} role="navigation" aria-label="Main navigation">
			<div className="flex items-center gap-[5px]">
				{/* BlockLoans Logo - Reduced size */}
				<img src={LogoHorizontal} alt="BlockLoans Logo" className="h-5" />
			</div>
			<div className="flex items-center gap-3">
				{/* Notifications Icon */}
				<button
					onClick={onNotificationClick}
					className={buttonClasses}
					aria-label="View notifications">
					<img
						src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/e3975f79483bc82c73eaf993f32260081d3511e6?placeholderIfAbsent=true"
						alt=""
						className={`aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto ${
							isDarkMode ? "filter brightness-0 invert" : ""
						}`}
					/>
				</button>

				{/* User Avatar */}
				<button
					onClick={onSettingsClick}
					className={buttonClasses}
					aria-label="Open settings">
					<img
						src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/ad487cab465b08eec6b51dff3014f32abba28313?placeholderIfAbsent=true"
						alt=""
						className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
					/>
				</button>
			</div>
		</nav>
	);
};
