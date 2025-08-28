import React from "react";
import { useTheme } from "../../context/ThemeContext"; // Import the theme context

export const MenuSection = ({ menuItems, className, uppercase = false }) => {
	const { isDarkMode } = useTheme(); // Use the theme context

	return (
		<div className={`flex flex-col gap-3 w-full max-w-full ${className || ""}`}>
			{menuItems.map((item) => {
				// Dynamic classes and styles based on theme
				const buttonClasses = `w-full max-w-full py-4 px-6 border border-transparent rounded-xl transition-colors text-left relative overflow-hidden min-h-[60px] flex items-center ${
					isDarkMode
						? "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
						: "bg-white hover:bg-gray-50"
				}`;

				const buttonStyle = isDarkMode
					? {
							background:
								"linear-gradient(#2a2a2a, #2a2a2a) padding-box, linear-gradient(to right, #DC2366, #4F5CAA) border-box",
							backgroundClip: "padding-box, border-box",
							border: "2px solid transparent",
					  }
					: {
							background:
								"linear-gradient(white, white) padding-box, linear-gradient(to right, #DC2366, #4F5CAA) border-box",
							backgroundClip: "padding-box, border-box",
							border: "2px solid transparent",
					  };

				return (
					<button
						key={item.id}
						onClick={item.onClick}
						className={buttonClasses}
						style={buttonStyle}
						role="menuitem">
						<span
							className={`bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent font-semibold text-[16px] leading-relaxed break-words whitespace-normal tracking-wide ${
								uppercase ? "uppercase" : ""
							}`}
							style={{
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
								display: "block",
								width: "100%",
							}}>
							{item.label}
						</span>
					</button>
				);
			})}
		</div>
	);
};
