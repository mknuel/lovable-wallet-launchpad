import React, { useEffect, useState } from "react";
import LandingBackground from "../assets/images/landing_background.png";
import CommonButton from "../components/Buttons/CommonButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { PATH_MAIN } from "../context/paths";
import LanguageSelector from "../components/LanguageSelector";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguage } from "../context/LanguageContext";

import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { isTMA } from "@telegram-apps/bridge";

import { useNavigate } from "react-router-dom";

// --- thirdweb imports ---
import { useConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "../components/thirdweb/thirdwebClient";

const role = {
	id: "614c68de1df56b0018b4ghdnkls",
	name: "Engineer",
};

const LandingScreen = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { currentLanguage, changeLanguage } = useLanguage();
	const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();

	// --- thirdweb hooks ---
	const { connect } = useConnect();
	const wallet = inAppWallet();

	let data = {};

	useEffect(() => {
		setSelectedLanguage(currentLanguage);
		console.log("Current Language:", currentLanguage);
	}, [currentLanguage]);

	const handleLanguageChange = (langCode) => {
		changeLanguage(langCode);
		setSelectedLanguage(langCode);
	};

	const handleSwipe = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		
		try {
			console.log("Starting authentication process...");
			console.log("Is Telegram Mini App:", isTMA());
			
			let walletAddress = null;
			
			if (isTMA()) {
				console.log("TMA Mode: Using custom auth endpoint for consistent wallet...");
				// In TMA, use custom auth endpoint to ensure same wallet for same Telegram user
				const initData = retrieveLaunchParams();
				const userId = initData.tgWebAppData.user.id.toString();
				console.log("Telegram User ID:", userId);
				
				const res = await connect(async () => {
					await wallet.connect({
						client,
						strategy: "auth_endpoint",
						payload: JSON.stringify({
							userId: userId,
							username: initData.tgWebAppData.user.username,
							first_name: initData.tgWebAppData.user.first_name,
							timestamp: Date.now()
						}),
						encryptionKey: "blockloans_telegram_auth_key_2025"
					});
					return wallet;
				});
				console.log("TMA Wallet connected successfully:", res);
				walletAddress = wallet.getAccount()?.address;
			} else {
				console.log("Web Mode: Using popup authentication...");
				// Outside TMA, use popup for broader wallet connection
				const res = await connect(async () => {
					await wallet.connect({
						client,
						strategy: "popup"
					});
					return wallet;
				});
				console.log("Web Wallet connected successfully:", res);
				walletAddress = wallet.getAccount()?.address;
			}
			
			console.log("Final wallet address:", walletAddress);

			if (isTMA()) {
				console.log("Getting Telegram Mini App user data...");
				try {
					const initData = retrieveLaunchParams();
					console.log("Telegram launch params:", initData);
					
					data = {
						hash: initData.tgWebAppData.hash,
						id: initData.tgWebAppData.user.id,
						username: initData.tgWebAppData.user.username,
						first_name: initData.tgWebAppData.user.first_name,
						last_name: initData.tgWebAppData.user.last_name,
						roleId: role.id,
						appsChannelKey: "abc",
						deviceId: "Apple",
						walletAddress: walletAddress,
					};
					console.log("Telegram Mini App data prepared:", data);
				} catch (tgError) {
					console.error("Error getting Telegram data:", tgError);
					throw new Error(`Telegram data error: ${tgError.message}`);
				}
			} else {
				console.log("Using fallback data for web mode...");
				data = {
					hash: "b40d003c86ed00d73608f08dce055eafc1eec4d2a83a516c62ac16541ce556e2",
					id: "7916246666",
					username: "mknuel",
					first_name: "Mk",
					last_name: "Nuel",
					roleId: role.id,
					appsChannelKey: "tg",
					deviceId: "Samsung",
					appId: "notTmamk",
					walletAddress: walletAddress,
				};
				console.log("Web mode data prepared:", data);
			}

			// Register user with the data
			console.log("Sending registration request...");
			api.post("/ssoauth/tgregister", data).then(async (res) => {
				console.log("Registration successful:", res);
				await handleLogin(PATH_MAIN);
			}).catch((regError) => {
				console.error("Registration failed:", regError);
				console.error("Registration error details:", regError.response?.data);
				throw new Error(`Registration failed: ${regError.message}`);
			});
		} catch (error) {
			console.error("Authentication error:", error);
			console.error("Error stack:", error.stack);
			console.error("Error details:", {
				message: error.message,
				name: error.name,
				isTMA: isTMA(),
				timestamp: new Date().toISOString()
			});
		} finally {
			setIsLoading(false);
		}
	};

	async function handleLogin(link) {
		const loginData = {
			id: data.id,
			first_name: data.first_name,
			deviceId: data.deviceId,
			hash: data.hash,
			username: data.username,
			last_name: data.last_name,
		};
		await api
			.post("/ssoauth/tglogin", loginData)
			.then((response) => {
				console.log("Login response:", response);
				if (response && response.success) {
					const userData = {
						userId: response.user._id,
						userName: response.user.userName,
						firstName: response.user.profile.firstName,
						lastName: response.user.profile.lastName,
						country: "",
						role: response.user.roles,
						email: response.user.email,
						profileId: response.user.profile._id,
						photo: response.user.profile.photo,
						gender: "male",
						walletAddress: response?.user?.walletAddress,
					};
					console.log(response);
					login(response.token, userData);
					navigate(link);
				} else {
					console.error("Login failed:", response.data);
				}
			})
			.catch((error) => {
				console.error("Login error:", error);
			});
	}

	return (
		<div className="container justify-around">
			<LanguageSelector
				selectedLanguage={selectedLanguage}
				onLanguageChange={handleLanguageChange}
			/>
			<div className="logo-container">
				<img className="logo" src={LandingBackground} alt="logo"></img>
			</div>
			<div className="text-container">
				<div className="title-container">
					<div className="title-text font-bold text-center">
						{t("landing.title_1") || "The Most"}
					</div>
					<div className="title-text font-bold text-center">
						{t("landing.title_2") || "Trusted & Secure"}
					</div>
					<div className="title-text font-bold text-center">
						{t("landing.title_3") || "Crypto Community"}
					</div>
				</div>

				<div className="description-text text-center">
					{t("landing.content") ||
						"Do you want a completely FREE way to earn real money? Money that you can send to your family in our Blockm Wallet, get a Doctor at BlockMed, a lesson at BlockMed, pay for products at BigMudi, a delivery/ride at BlockRide, convert to local currency with Lendsend, pay for your energy bills, recharge airtime and data for your Mobile service?"}
				</div>
			</div>
			<div className="flex flex-col justify-end items-center">
				<div className="button-container">
					<CommonButton onClick={handleSwipe} width="auto" height="48px" disabled={isLoading}>
						{isLoading ? (
							<span className="font-regular text-[13px]">Loading...</span>
						) : (
							<>
								<ArrowForwardIcon className="icon mr-0.5" />
								<span className="font-regular text-[13px]">
									{t("landing.button") || "TAP TO BEGIN"}
								</span>
							</>
						)}
					</CommonButton>
				</div>
			</div>
		</div>
	);
};

export default LandingScreen;
