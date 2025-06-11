import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PATH_SETTING } from "../../context/paths";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import BlockMed from "../../assets/icons/add.svg";
import BlockM from "../../assets/icons/megaphone.svg";
import BlockEd from "../../assets/icons/megaphone.svg";
import BlockMudi from "../../assets/icons/coupon.svg";
import BlockRide from "../../assets/icons/motocross.svg";
import ArtistNft from "../../assets/icons/payment.svg";
import BlockFarm from "../../assets/icons/coins.svg";
import BlockLoan from "../../assets/icons/coin.svg";
import Messages from "../../assets/icons/email.svg";
import Profile from "../../assets/icons/user.svg";
import Logout from "../../assets/icons/logout.svg";
import LogoHorizontal from "../../assets/images/Logo_Bloackloans_Horizontal.png";

const HeaderMenu = ({ isOpen, onClose, className }) => {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleMyProfile = () => {
		navigate(PATH_SETTING);
		onClose();
	};

	const handleLogout = () => {
		logout();
		onClose();
	};

	const menuItems = [
		{ id: "blockm", label: "Block M", icon: BlockM, disabled: true },
		{ id: "blockmud", label: "Block Mud", icon: BlockMudi, disabled: true },
		{ id: "blockmed", label: "Block Med", icon: BlockMed, disabled: true },
		{ id: "blocked", label: "Block Ed", icon: BlockEd, disabled: true },
		{ id: "blockride", label: "Block Ride", icon: BlockRide, disabled: true },
		{ id: "artistnft", label: "Artist NFT", icon: ArtistNft, disabled: true },
		{ id: "blockloans", label: "Blockloans", icon: BlockLoan, disabled: true },
		{ id: "blockfarm", label: "Block Farm", icon: BlockFarm, disabled: true },
		{ id: "messages", label: "Messages", icon: Messages, disabled: true },
		{
			id: "myprofile",
			label: "My Profile",
			icon: Profile,
			onClick: handleMyProfile,
		},
	];

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						className="absolute inset-0 h-[100dvh] bg-black/20 z-40"
						onClick={onClose}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					/>

					{/* Sliding Menu */}
					<motion.div
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ duration: 0.3 }}
						className={`absolute top-0 right-0 h-[100dvh] w-[70%] bg-white z-50 shadow-2xl rounded-l-2xl flex flex-col ${
							className || ""
						}`}>
						{/* Header */}
						<div className="flex items-center justify-between p-4 pl-5">
							<div className="flex items-center gap-3">
								<img
									src={LogoHorizontal}
									alt="BlockLoans Logo"
									className="h-6"
								/>
							</div>
							<button
								onClick={onClose}
								className="p-2 rounded-md hover:bg-gray-100 transition-colors"
								aria-label="Close menu">
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M15 5L5 15M5 5L15 15"
										stroke="#666666"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						</div>

						{/* Menu Content */}
						<div className="flex-1 overflow-y-auto px-4 pb-2">
							<div className="space-y-3">
								{menuItems.map((item) => (
									<button
										key={item.id}
										onClick={item.onClick}
										disabled={item.disabled}
										className={`w-full flex items-center gap-3 px-2 py-1 text-left rounded-lg transition-colors ${
											item.disabled
												? "cursor-not-allowed opacity-50"
												: "text-black cursor-pointer hover:bg-gray-50"
										}`}>
										<span className="w-8">
											<img src={item.icon} alt={item.label} />
										</span>
										<span className="text-sm uppercase font-medium font-['Sansation']">
											{item.label}
										</span>
									</button>
								))}
							</div>
						</div>

						{/* Logout Button */}
						<div className="border-gray-200 p-4">
							<button
								onClick={handleLogout}
								className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
								<img src={Logout} />
								<span className="text-sm font-['Sansation'] text-red-600 font-bold">
									LOGOUT
								</span>
							</button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default HeaderMenu;
