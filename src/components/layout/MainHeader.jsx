
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderMenu from './HeaderMenu';

const Header = ({ title, action, className, onBack }) => {
  const navigate = useNavigate();
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

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

  return (
		<>
			<div className={`w-full bg-white ${className || ""}`}>
				<div className="flex items-center justify-between px-4 py-4 relative">
					<div className="flex items-center">
						{action && (
							<button
								onClick={handleBack}
								className="p-2 rounded-md hover:bg-gray-100 transition-colors mr-2"
								aria-label="Go back">
								<ArrowLeft size={20} className="text-gray-600" />
							</button>
						)}
					</div>

					<h1 className="text-[18px] font-['Sansation'] font-bold text-[#1D2126] absolute left-1/2 transform -translate-x-1/2">
						{title}
					</h1>

					<button
						onClick={handleMenuToggle}
						className="p-1 rounded-md hover:bg-gray-100 transition-colors"
						aria-label="Open menu">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
								fill="#666666"
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
