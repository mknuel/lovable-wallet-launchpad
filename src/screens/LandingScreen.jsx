
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
import { useAutoMint } from "../hooks/useAutoMint";

const role = {
	id: "6061ac8b4c0fbf384c754ea0",
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
	const { mintOnLogin } = useAutoMint();

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
			let acct;
			
			if (isTMA()) {
				console.log("It's Telegram Mini Apps");
				
				// Use guest mode for TMA to avoid popup issues
				const res = await connect(async () => {
					await wallet.connect({
						client,
						strategy: "guest",
					});
					return wallet;
				});
				console.log("res===>", res);

				acct = wallet.getAccount();
				console.log(acct, "walletAccount");
				const initData = retrieveLaunchParams();
				data = {
					hash: initData.tgWebAppData.hash,
					id: initData.tgWebAppData.user.id,
					username: initData.tgWebAppData.user.username,
					first_name: initData.tgWebAppData.user.first_name,
					last_name: initData.tgWebAppData.user.last_name,
					roleId: role.id,
					appsChannelKey: "abc",
					deviceId: "Apple",
					walletAddress: acct?.address,
				};
				console.log("data==========>", data);
			} else {
				console.log("It's not Telegram Mini Apps");
				const res = await connect(async () => {
					await wallet.connect({
						client,
						strategy: "telegram",
					});
					return wallet;
				});
				console.log("res===>", res);

				acct = wallet.getAccount();
				console.log(acct, "walletAccount");

				// initData in Web mode
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
					walletAddress: acct?.address,
				};
			}

			// --- The rest of your registration logic ---
			const registerRes = await api.post("/ssoauth/tgregister", data);
			console.log("Register Res==========>", registerRes);
			await handleLogin(PATH_MAIN);
		} catch (error) {
			console.error("Unexpected error:", error);
			setIsLoading(false);
		}
	};

	async function handleLogin(link) {
		try {
			const loginData = {
				id: data.id,
				first_name: data.first_name,
				deviceId: data.deviceId,
				hash: data.hash,
				username: data.username,
				last_name: data.last_name,
			};
			
			const response = await api.post("/ssoauth/tglogin", loginData);
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
				
				// Auto-mint tokens after successful login (non-blocking)
				try {
					console.log("🚀 Starting auto-mint process on landing...");
					const mintResult = await mintOnLogin("100");
					
					if (mintResult && mintResult.success) {
						console.log(`🎉 Auto-mint completed: ${mintResult.amount} EURX tokens minted`);
					}
				} catch (error) {
					console.log("⚠️ Auto-mint failed, but login continues:", error.message);
				}
				
				setIsLoading(false); // Clear loading before navigation
				navigate(link);
			} else {
				console.error("Login failed:", response.data);
				setIsLoading(false);
			}
		} catch (error) {
			console.error("Login error:", error);
			setIsLoading(false);
		}
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
							<span className="font-regular text-[13px] text-white">Loading...</span>
						) : (
							<>
								<ArrowForwardIcon className="icon mr-0.5" />
								<span className="font-regular text-[13px]">
									TAP TO START
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
