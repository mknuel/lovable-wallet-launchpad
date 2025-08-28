import IconButton from "@mui/material/IconButton";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MessageIcon from "@mui/icons-material/Message";
import GroupIcon from "@mui/icons-material/Group";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { PATH_MAIN, PATH_SETTING } from "../../context/paths";
import { useTheme } from "../../context/ThemeContext"; // Import the theme context

const Navigation = ({ nav }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { t } = useTranslation();
	const { isDarkMode } = useTheme(); // Use the theme context

	// Determine if main menu should be active based on current route
	const isMainMenuActive =
		location.pathname === "/main" ||
		location.pathname.startsWith("/wallet") ||
		location.pathname.startsWith("/blockloans");

	// Show swap-specific navigation for swap screen
	const isSwapScreen = nav === "Swap";

	// Dynamic classes based on theme
	const containerClasses = `flex flex-col py-3 w-full shadow-2xl z-30 ${
		isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
	}`;

	if (isSwapScreen) {
		return (
			<div className={containerClasses}>
				<div className="flex flex-row justify-around items-center pb-3 px-4">
					<IconButton
						sx={{
							"&:focus": {
								outline: "none",
								boxShadow: "none",
							},
							padding: 0,
						}}
						className="flex flex-col items-center flex-1">
						<SwapHorizIcon
							sx={{
								width: 20,
								height: 20,
								color: "#9C27B0",
							}}
						/>
						<div
							className="font-bold text-[14px] text-center"
							style={{
								background: "linear-gradient(to right, #DC2366, #4F5CAA)",
								WebkitBackgroundClip: "text",
								backgroundClip: "text",
								color: "transparent",
							}}>
							Select
						</div>
					</IconButton>

					<IconButton
						sx={{
							"&:focus": {
								outline: "none",
								boxShadow: "none",
							},
							padding: 0,
						}}
						className="flex flex-col items-center flex-1">
						<CheckCircleIcon
							sx={{
								width: 20,
								height: 20,
								color: isDarkMode ? "#666666" : "#837E7E",
							}}
						/>
						<div
							className="font-bold text-[14px] text-center"
							style={{
								background: isDarkMode ? "#666666" : "#ACB1B5",
								WebkitBackgroundClip: "text",
								backgroundClip: "text",
								color: "transparent",
							}}>
							Confirm
						</div>
					</IconButton>

					<IconButton
						sx={{
							"&:focus": {
								outline: "none",
								boxShadow: "none",
							},
							padding: 0,
						}}
						className="flex flex-col items-center flex-1">
						<SecurityIcon
							sx={{
								width: 20,
								height: 20,
								color: isDarkMode ? "#666666" : "#837E7E",
							}}
						/>
						<div
							className="font-bold text-[14px] text-center"
							style={{
								background: isDarkMode ? "#666666" : "#ACB1B5",
								WebkitBackgroundClip: "text",
								backgroundClip: "text",
								color: "transparent",
							}}>
							Security
						</div>
					</IconButton>
				</div>
			</div>
		);
	}

	return (
		<div className={containerClasses}>
			<div className="flex flex-row justify-around items-center pb-3 px-4">
				<IconButton
					aria-label="back"
					sx={{
						"&:focus": {
							outline: "none",
							boxShadow: "none",
						},
						padding: 0,
					}}
					className="flex flex-col items-center flex-1"
					onClick={() => navigate(PATH_MAIN)}>
					<AccountBalanceWalletIcon
						sx={{
							width: 20,
							height: 20,
							color: isMainMenuActive
								? "#9C27B0"
								: isDarkMode
								? "#666666"
								: "#837E7E",
						}}
					/>
					<div
						className="font-bold text-[14px] text-center"
						style={{
							background: isMainMenuActive
								? "linear-gradient(to right, #DC2366, #4F5CAA)"
								: isDarkMode
								? "#666666"
								: "#ACB1B5",
							WebkitBackgroundClip: "text",
							backgroundClip: "text",
							color: "transparent",
						}}>
						{t("navigation.mainMenu") || "Main Menu"}
					</div>
				</IconButton>
				<IconButton
					aria-label="back"
					sx={{
						"&:focus": {
							outline: "none",
							boxShadow: "none",
						},
						padding: 0,
					}}
					className="flex flex-col items-center flex-1">
					<MessageIcon
						sx={{
							width: 20,
							height: 20,
							color:
								nav == "Message"
									? "#9C27B0"
									: isDarkMode
									? "#666666"
									: "#837E7E",
						}}
					/>
					<div
						className="font-bold text-[14px] text-center"
						style={{
							background:
								nav == "Message"
									? "linear-gradient(to right, #DC2366, #4F5CAA)"
									: isDarkMode
									? "#666666"
									: "#ACB1B5",
							WebkitBackgroundClip: "text",
							backgroundClip: "text",
							color: "transparent",
						}}>
						{t("navigation.message") || "Message"}
					</div>
				</IconButton>
				<IconButton
					aria-label="back"
					sx={{
						"&:focus": {
							outline: "none",
							boxShadow: "none",
						},
						padding: 0,
					}}
					className="flex flex-col items-center flex-1"
					onClick={() => navigate(PATH_SETTING)}>
					<GroupIcon
						sx={{
							width: 20,
							height: 20,
							color:
								nav == "Profile"
									? "#9C27B0"
									: isDarkMode
									? "#666666"
									: "#837E7E",
						}}
					/>
					<div
						className="font-bold text-[14px] text-center"
						style={{
							background:
								nav == "Profile"
									? "linear-gradient(to right, #DC2366, #4F5CAA)"
									: isDarkMode
									? "#666666"
									: "#ACB1B5",
							WebkitBackgroundClip: "text",
							backgroundClip: "text",
							color: "transparent",
						}}>
						{t("navigation.profile") || "Profile"}
					</div>
				</IconButton>
			</div>
		</div>
	);
};

export default Navigation;
