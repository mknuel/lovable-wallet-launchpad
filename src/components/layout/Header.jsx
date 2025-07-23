
import React from 'react';
import { Bell } from 'lucide-react';
import LogoHorizontal from "../../assets/images/Logo_Bloackloans_Horizontal.png";

export const Header = ({
  onMenuClick,
  onNotificationClick,
  onSettingsClick,
  className
}) => {
  return (
		<nav
			className={`w-full items-center flex justify-between bg-white  pl-5 pr-4 py-4 ${
				className || ""
			}`}
			role="navigation"
			aria-label="Main navigation">
			<div className="flex items-center gap-[5px]">
				{/* BlockLoans Logo - Reduced size */}
				<img src={LogoHorizontal} alt="BlockLoans Logo" className="h-5" />
			</div>
			<div className="flex items-center gap-3">
				{/* Notifications Icon */}
				<button
					onClick={onNotificationClick}
					className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					aria-label="View notifications">
					<img
						src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/e3975f79483bc82c73eaf993f32260081d3511e6?placeholderIfAbsent=true"
						alt=""
						className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
					/>
				</button>

				{/* User Avatar */}
				<button
					onClick={onSettingsClick}
					className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
