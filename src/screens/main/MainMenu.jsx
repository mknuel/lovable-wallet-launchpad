import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/layout/Header";
import { StatsCard } from "../../components/layout/StatsCard";
import { MenuSection } from "../../components/layout/MenuSection";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector, useDispatch } from "react-redux";
import { useERC20Token } from "../../hooks/useERC20";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import {
	fetchWallet,
	selectWalletData,
	selectWalletLoading,
	invalidateWalletCache,
} from "../../store/reducers/walletSlice";
import CreatePinScreen from "./CreatePinScreen";
import WalletScreen from "./WalletScreen";
import { PATH_WALLET, PATH_BLOCKLOANS } from "../../context/paths";
import CommonButton from "../../components/Buttons/CommonButton";
import Success from "../../assets/icons/pin-success.svg";
import { useTheme } from "../../context/ThemeContext";

const MainMenu = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { isDarkMode } = useTheme();

	// Use optimized selectors
	const walletData = useSelector(selectWalletData);
	const walletLoading = useSelector(selectWalletLoading);

	const navigate = useNavigate();

	// Simplified state management
	const [currentScreen, setCurrentScreen] = useState("main");
	const [showPinConfirmation, setShowPinConfirmation] = useState(false);

	// Fetch wallet data on component mount - only if not already loading/loaded
	useEffect(() => {
		if (!walletData && !walletLoading) {
			dispatch(fetchWallet());
		}
	}, [dispatch, walletData, walletLoading]);

	// Handle wallet data and PIN status - DISABLED PIN REQUIREMENT
	useEffect(() => {
		if (walletLoading || !walletData) return;

		// PIN functionality disabled - no longer checking PIN status
		// const hasPin = walletData?.data?.isPinCodeSet;
		// if (!hasPin) {
		//   setCurrentScreen("createPin");
		// }
	}, [walletData, walletLoading]);

	// Token balance from API and EURX (crypto) balance
	const { loading: tokenLoading, formattedBalance: formattedTokenBalance } = useTokenBalance();
	const { balance: erc20Balance, loading: erc20Loading } = useERC20Token();

	// Memoize stats data to prevent unnecessary recalculations
	const statsData = useMemo(() => {
		// Token balance from API
		const tokenValue = tokenLoading ? "..." : formattedTokenBalance;
		// EURX balance as crypto
		const eurxValue = erc20Loading ? "..." : parseFloat(erc20Balance || '0').toFixed(1);
		
		return [
			{ 
				id: "token", 
				value: tokenValue, 
				label: t("wallet.tokens")
			},
			{
				id: "crypto",
				value: eurxValue,
				label: t("wallet.crypto"),
			},
			{ id: "loans", value: "0", label: t("wallet.loans") },
		];
	}, [tokenLoading, formattedTokenBalance, erc20Loading, erc20Balance, t]);

	const handleWalletClick = useCallback(() => {
		// PIN check disabled - direct navigation to wallet
		navigate(PATH_WALLET);
	}, [navigate]);

	// Memoize menu items to prevent unnecessary re-renders
	const menuItems = useMemo(
		() => [
			{
				id: "wallet",
				label: t("mainMenu.myWallet"),
				onClick: handleWalletClick,
			},
			{
				id: "settings",
				label: t("mainMenu.settings"),
				onClick: () => navigate("/setting"),
			},
			{
				id: "blockloans",
				label: t("mainMenu.blockloans"),
				onClick: () => navigate(PATH_BLOCKLOANS),
			},
		],
		[t, handleWalletClick, navigate]
	);

	const handlePinCreated = () => {
		localStorage.setItem("userHasPin", "true");
		
		// Invalidate wallet cache and refetch to get updated PIN status
		dispatch(invalidateWalletCache());
		dispatch(fetchWallet());
		
		setShowPinConfirmation(true);
	};

	const handleBack = () => {
		setCurrentScreen("main");
	};

	// Render appropriate screen based on current state
	switch (currentScreen) {
		case "createPin":
			return (
				<CreatePinScreen
					onPinCreated={handlePinCreated}
					onBack={handleBack}
					walletData={walletData}
				/>
			);

		case "wallet":
			return <WalletScreen onBack={handleBack} walletData={walletData} />;

		default:
			return (
				<div className={`flex items-center flex-col min-h-screen w-full max-w-full ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-white text-black'}`}>
					<div className={`w-full sticky top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
						<Header
							onMenuClick={() => console.log("Menu clicked")}
							onNotificationClick={() => console.log("Notifications clicked")}
							onSettingsClick={() => navigate("/setting")}
						/>
					</div>

					<div className="relative w-full max-w-full overflow-y-auto overflow-x-hidden px-6 pt-6 pb-20">
						<div className="w-full max-w-full mb-6">
							<StatsCard stats={statsData} />
						</div>

						<div className="w-full max-w-full mb-8">
							<MenuSection menuItems={menuItems} uppercase={true} />
						</div>

						<div className="w-full max-w-full">
							<CommonButton
								onClick={() => console.log("Next button clicked")}
								ariaLabel="Proceed to next step"
								className="w-full h-[48px]">
								{t("mainMenu.next")}
							</CommonButton>
						</div>
					</div>

					<div className={`w-full fixed bottom-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
						<Navigation nav={t("navigation.mainMenu")} />
					</div>

					{/* PIN Confirmation Modal - Fixed z-index */}
					{showPinConfirmation && (
						<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
							<div className={`rounded-xl p-4 pt-8 mx-4 max-w-sm w-full text-center ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
								<div className="flex justify-center mb-3">
									<img src={Success} alt="Success" />
								</div>
								<h2 className={`text-[20px] font-['Sansation'] font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
									{t("mainMenu.pinCreated")}
								</h2>
								<p className={`text-[16px] font-['Sansation'] mb-8 w-[80%] mx-auto ${isDarkMode ? 'text-gray-300' : 'text-[#616161]'}`}>
									{t("mainMenu.pinCreatedMessage")}
								</p>
								<button
									onClick={() => {
										setShowPinConfirmation(false);
										navigate(PATH_WALLET);
									}}
									className="w-full h-[48px] bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white text-[16px] font-['Sansation']  rounded-lg hover:opacity-90 transition-opacity">
									OK
								</button>
							</div>
						</div>
					)}
				</div>
			);
	}
};

export default MainMenu;
