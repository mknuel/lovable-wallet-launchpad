import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/layout/Header";
import { StatsCard } from "../../components/layout/StatsCard";
import { MenuSection } from "../../components/layout/MenuSection";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector, useDispatch } from "react-redux";
import { fetchWallet, selectWalletData, selectWalletLoading, selectWalletError } from "../../store/reducers/walletSlice";
import CreatePinScreen from "./CreatePinScreen";
import PinEntryScreen from "./PinEntryScreen";
import WalletScreen from "./WalletScreen";
import { PATH_WALLET } from "../../context/paths";
import CommonButton from "../../components/Buttons/CommonButton";
import Success from "../../assets/icons/pin-success.svg";

const MainMenu = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.user);
	
	// Use optimized selectors
	const walletData = useSelector(selectWalletData);
	const walletLoading = useSelector(selectWalletLoading);
	const walletError = useSelector(selectWalletError);
	
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

	// Handle wallet data and PIN status - ONLY for first-time users who need to create a PIN
	useEffect(() => {
		if (walletLoading || !walletData) return;

		const hasPin = walletData?.data?.isPinCodeSet;

		// Only redirect to create PIN if user doesn't have one yet
		if (!hasPin) {
			setCurrentScreen("createPin");
		}
		// If user has PIN, stay on main menu - don't auto-redirect to PIN entry
	}, [walletData, walletLoading]);

	// Memoize stats data to prevent unnecessary recalculations
	const statsData = useMemo(() => {
		return walletData?.data
			? [
					{
						id: "tokens",
						value: walletData.data.token || "0",
						label: t("wallet.tokens"),
					},
					{
						id: "crypto",
						value: walletData.data.balance || "0",
						label: t("wallet.crypto"),
					},
					{ id: "loans", value: "0", label: t("wallet.loans") },
			  ]
			: [
					{ id: "tokens", value: "0", label: t("wallet.tokens") },
					{ id: "crypto", value: "0", label: t("wallet.crypto") },
					{ id: "loans", value: "0", label: t("wallet.loans") },
			  ];
	}, [walletData, t]);

	const handleWalletClick = () => {
		if (!walletData?.data) return;

		if (!walletData.data.isPinCodeSet) {
			setCurrentScreen("createPin");
		} else {
			// User has PIN, so ask them to enter it to access wallet
			setCurrentScreen("enterPin");
		}
	};

	// Memoize menu items to prevent unnecessary re-renders
	const menuItems = useMemo(() => [
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
			onClick: () => console.log("Navigate to blockloans"),
		},
	], [t, handleWalletClick, navigate]);

	const handlePinCreated = () => {
		localStorage.setItem("userHasPin", "true");
		localStorage.removeItem("needsPinEntry");
		setShowPinConfirmation(true);

		setTimeout(() => {
			setShowPinConfirmation(false);
			navigate(PATH_WALLET);
		}, 3000);
	};

	const handlePinVerified = () => {
		localStorage.removeItem("needsPinEntry");
		navigate(PATH_WALLET);
	};

	const handleBack = () => {
		setCurrentScreen("main");
	};

	// Render appropriate screen based on current state
	switch (currentScreen) {
		case "createPin":
			return (
				<PinEntryScreen
					onPinVerified={handlePinVerified}
					onBack={handleBack}
					walletData={walletData}
					onShowCreatePin={() => setCurrentScreen("createPin")}
				/>
			);

		case "enterPin":
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
				<div className="flex items-center flex-col min-h-screen w-full max-w-full ">
					<div className="w-full sticky top-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a]">
						<Header
							onMenuClick={() => console.log("Menu clicked")}
							onNotificationClick={() => console.log("Notifications clicked")}
							onSettingsClick={() => navigate("/setting")}
						/>
					</div>

					<div className="relative w-full max-w-full overflow-y-auto overflow-x-hidden px-6 py-6 mt-3 mb-[40px]">
						<div className="w-full max-w-full mb-6">
							<StatsCard stats={statsData} />
						</div>

						<div className="w-full max-w-full mb-8">
							<MenuSection menuItems={menuItems} />
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

					<div className="w-full sticky bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a]">
						<Navigation nav={t("navigation.mainMenu")} />
					</div>

					{/* PIN Confirmation Modal - Fixed z-index */}
					{showPinConfirmation && (
						<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
							<div className="bg-white rounded-xl p-4 pt-8 mx-4 max-w-sm w-full text-center">
								<div className="flex justify-center mb-3">
									<img src={Success} alt="Success" />
								</div>
								<h2 className="text-[20px] font-['Sansation'] font-bold text-black mb-2">
									{t("mainMenu.pinCreated")}
								</h2>
								<p className="text-[16px] font-['Sansation'] text-[#616161] mb-8 w-[80%] mx-auto">
									{t("mainMenu.pinCreatedMessage")}
								</p>
								<button
									onClick={() => setShowPinConfirmation(false)}
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
