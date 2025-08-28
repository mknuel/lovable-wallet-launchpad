/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { useActiveAccount } from "thirdweb/react";

import Header from "../../components/layout/MainHeader";
import Navigation from "../../components/layout/Navigation";
import ProfileRectangle from "../../assets/images/Profile_Rectangle.png";
import DarkProfileRectangle from "../../assets/images/Dark_Profile_Rectangle.png";
import Avatar from "../../assets/images/Avatar.png";
import api from "../../utils/api";
import { copyToClipboard, formatAddress } from "../../utils/utils";
import { PATH_LANGUAGE } from "../../context/paths";
import { useTranslation } from "../../hooks/useTranslation";
import { useWalletAccount } from "../../context/WalletAccountContext";
import { useTheme } from "../../context/ThemeContext";
import ThirdwebConnectButton from "../../components/thirdweb/ThirdwebConnectButton";
import CustomTonConnectButton from "../../components/Buttons/CustomTonConnectButton";

import PeopleIcon from "@mui/icons-material/People";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LanguageIcon from "@mui/icons-material/Language";
import LockIcon from "@mui/icons-material/Lock";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

const PinkSwitch = styled(Switch)(() => ({
	"& .MuiSwitch-switchBase.Mui-checked": {
		// Remove `color` and replace with `background`
		"& .MuiSwitch-thumb": {
			background: "linear-gradient(to right, #DC2366, #4F5CAA)", // Gradient for thumb
			// borderRadius: "50%", // Ensure it stays circular
		},
	},
	"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
		backgroundColor: "#F487B3", // Track color when checked
	},
}));

const SettingScreen = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { currentWalletAccount } = useWalletAccount();
	const { isDarkMode, toggleTheme } = useTheme();
	const userTonAddress = useTonAddress();
	const activeAccount = useActiveAccount();

	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		photo: Avatar,
		walletAddress: "0x32de343894f8e0124dC4fEe",
	});

	const [copied, setCopied] = useState(false);
	const [profileId, setProfileId] = useState(null);

	useEffect(() => {
		async function fetch() {
			await api.get("/auth/me").then((res) => {
				const data = {
					firstName: res.data.profile.firstName,
					lastName: res.data.profile.lastName,
					email: res.data.user.email,
					phone: res.data.user.phone,
					photo:
						res.data.profile.photo === "no-photo.jpg"
							? Avatar
							: res.data.profile.photo,
					walletAddress: userData.walletAddress,
				};
				setUserData(data);
				setProfileId(res.data.profile._id);
			});
		}
		fetch();
	}, []);

	const handleDarkModeToggle = () => {
		console.log("Dark Mode toggled");
		toggleTheme();
	};

	return (
		<div className="container">
			<div className="sticky top-0 left-0 w-full z-40">
				<Header
					title={t("setting.title") || "My settings"}
					action={true}></Header>
			</div>
			<div className="flex flex-col w-full h-[100dvh] overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-5">
				<div>
					<img
						src={
							isDarkMode
								? DarkProfileRectangle // Dark
								: ProfileRectangle // White
						}
						alt="Settings background"
						className="absolute top-0 left-0 -z-10 w-screen h-[265px]"></img>
					<div className="flex flex-col justify-center items-center relative bottom-0 pt-[90px]">
						<img
							src={userData.photo || Avatar}
							alt="avatar"
							className="w-[120px] h-[120px] pb-[5px]"></img>
						<div className="font-bold text-[22px] text-center">
							{userData.firstName} {userData.lastName}
						</div>
						<div className="font-regular text-[14px]">{userData.phone}</div>
					</div>
				</div>
				<div className="flex flex-col gap-2 w-full mt-[20px]">
					<div className={`flex flex-col border-2 rounded-lg p-2 ${
						isDarkMode 
							? 'border-gray-600 bg-[#2a2a2a]' 
							: 'border-[var(--border)] bg-[var(--surface)]'
					}`}>
						<div
							className="flex flex-row items-center gap-4 justify-between"
							onClick={() => navigate("/edit-profile")}>
							<div className="flex flex-row items-center gap-[13px]">
								<PeopleIcon sx={{ width: 16, height: 16, color: "#837E7E" }} />
								<div className="font-regular text-[14px]">
									{t("setting.editProfile") || "Edit profile"}
								</div>
							</div>
							<ChevronRightIcon sx={{ width: 16, height: 16 }} />
						</div>
						<div className="flex flex-row items-center gap-4 justify-between">
							<div className="flex flex-row items-center gap-[13px]">
								<NotificationsActiveIcon
									sx={{ width: 16, height: 16, color: "#837E7E" }}
								/>
								<div className="font-regular text-[14px]">
									{t("setting.notification") || "Notifications"}
								</div>
							</div>
							<PinkSwitch edge="end" />
						</div>
						<div
							className="flex flex-row items-center gap-4 justify-between"
							onClick={() => navigate(PATH_LANGUAGE)}>
							<div className="flex flex-row items-center gap-[13px]">
								<LanguageIcon
									sx={{ width: 16, height: 16, color: "#837E7E" }}
								/>
								<div className="font-regular text-[14px]">
									{t("setting.language") || "Language"}
								</div>
							</div>
							<div className="text-[14px]">{t("currentlang") || "English"}</div>
						</div>
					</div>
					<div className={`flex flex-col border-2 rounded-lg p-2 ${
						isDarkMode 
							? 'border-gray-600 bg-[#2a2a2a]' 
							: 'border-[#EFEFEF] bg-white'
					}`}>
						<div className="flex flex-row items-center gap-4 justify-between">
							<div className="flex flex-row items-center gap-[13px]">
								<NotificationsActiveIcon
									sx={{ width: 16, height: 16, color: "#837E7E" }}
								/>
								<div className="font-regular text-[14px]">
									{t("setting.lightMode") || "Light Mode"}
								</div>
							</div>
							<PinkSwitch
								edge="end"
								checked={!isDarkMode}
								onChange={handleDarkModeToggle}
							/>
						</div>
						<div className="flex flex-row items-center gap-4 justify-between">
							<div className="flex flex-row items-center gap-[13px]">
								<LockIcon sx={{ width: 16, height: 16, color: "#837E7E" }} />
								<div className="font-regular text-[14px]">
									{t("setting.privacyPolciy") || "Privacy Policy"}
								</div>
							</div>
							<ChevronRightIcon sx={{ width: 16, height: 16 }} />
						</div>
					</div>
					<div className={`flex flex-col gap-4 border-2 rounded-lg p-2 ${
						isDarkMode 
							? 'border-gray-600 bg-[#2a2a2a]' 
							: 'border-[#EFEFEF] bg-white'
					}`}>
						<div className="flex flex-row items-center gap-4 justify-between">
							<div
								className="flex flex-row items-center gap-[13px]"
								onClick={() => {
									const addressToCopy =
										userTonAddress ||
										activeAccount?.address ||
										currentWalletAccount ||
										userData.walletAddress;
									copyToClipboard(addressToCopy, setCopied);
								}}>
								<QrCodeIcon sx={{ width: 32, height: 32, color: "#837E7E" }} />
								<div className="flex flex-col">
									<div className="font-regular text-[14px]">
										{t("setting.walletAddress") || "Wallet Address"}
									</div>
									<div className="wallet-address-container">
										<span className="wallet-address">
											{userTonAddress
												? formatAddress(userTonAddress, 8, 4)
												: activeAccount?.address
												? formatAddress(activeAccount.address, 8, 4)
												: currentWalletAccount
												? formatAddress(currentWalletAccount, 8, 4)
												: formatAddress(userData.walletAddress, 8, 4)}
										</span>
										{copied ? (
											<CheckIcon className="settings-icon check-icon" />
										) : (
											<ContentCopyIcon />
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<ThirdwebConnectButton darkMode={isDarkMode} path={null} />
					<div className="flex w-full justify-center items-center">
						<CustomTonConnectButton />
					</div>
				</div>
			</div>

			<div className="sticky bottom-0 left-0 w-full z-40">
				<Navigation nav="Profile"></Navigation>
			</div>
		</div>
	);
};

export default SettingScreen;
