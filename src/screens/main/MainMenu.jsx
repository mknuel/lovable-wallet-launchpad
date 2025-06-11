
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/layout/Header";
import { StatsCard } from "../../components/layout/StatsCard";
import { MenuSection } from "../../components/layout/MenuSection";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector, useDispatch } from "react-redux";
import { fetchWallet } from "../../store/reducers/walletSlice";
import CreatePinScreen from "./CreatePinScreen";
import PinEntryScreen from "./PinEntryScreen";
import WalletScreen from "./WalletScreen";
import { PATH_WALLET } from "../../context/paths";
import CommonButton from "../../components/Buttons/CommonButton";

const MainMenu = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.user);
	const {
		walletData,
		isLoading: walletLoading,
		error: walletError,
	} = useSelector((state) => state.wallet);
	const navigate = useNavigate();

	// Simplified state management
	const [currentScreen, setCurrentScreen] = useState("main"); // 'main', 'createPin', 'enterPin', 'wallet'
	const [showPinConfirmation, setShowPinConfirmation] = useState(false);

	// Fetch wallet data on component mount
	useEffect(() => {
		dispatch(fetchWallet());
	}, [dispatch]);

	// Handle wallet data and PIN status
	useEffect(() => {
		if (walletLoading || !walletData) return;

		const hasPin = walletData?.data?.isPinCodeSet;
		const needsPinEntry = localStorage.getItem("needsPinEntry") === "true";

		if (!hasPin) {
			// First-time user needs to create PIN
			setCurrentScreen("createPin");
		} else if (needsPinEntry) {
			// Existing user needs to enter PIN
			setCurrentScreen("enterPin");
		}
	}, [walletData, walletLoading]);

	const statsData = walletData?.data
		? [
				{ id: "tokens", value: walletData.data.token || "0", label: t("wallet.tokens") },
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

	const handleWalletClick = () => {
		if (!walletData?.data) return;

		if (!walletData.data.isPinCodeSet) {
			setCurrentScreen("createPin");
		} else {
			localStorage.setItem("needsPinEntry", "true");
			setCurrentScreen("enterPin");
		}
	};

	const menuItems = [
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
	];

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
				<CreatePinScreen
					onPinCreated={handlePinCreated}
					onBack={handleBack}
					walletData={walletData}
				/>
			);

		case "enterPin":
			return (
				<PinEntryScreen
					onPinVerified={handlePinVerified}
					onBack={handleBack}
					walletData={walletData}
					onShowCreatePin={() => setCurrentScreen("createPin")}
				/>
			);

		case "wallet":
			return <WalletScreen onBack={handleBack} walletData={walletData} />;

		default:
			return (
				<div className="flex items-center flex-col min-h-screen w-full max-w-full overflow-hidden">
					<div className="w-full fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a]">
						<Header
							onMenuClick={() => console.log("Menu clicked")}
							onNotificationClick={() => console.log("Notifications clicked")}
							onSettingsClick={() => navigate("/setting")}
						/>
					</div>

					<div className="relative w-full max-w-full overflow-y-auto overflow-x-hidden px-6 py-6 mt-[66px] mb-[80px]">
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

					<div className="w-full fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a]">
						<Navigation nav={t("navigation.mainMenu")} />
					</div>

					{/* PIN Confirmation Modal */}
					{showPinConfirmation && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
							<div className="bg-white dark:bg-[#222222] rounded-lg p-8 mx-4 max-w-sm w-full text-center">
								<div className="flex justify-center mb-6">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="57"
										height="52"
										viewBox="0 0 57 52"
										fill="none">
										{/* SVG paths remain the same */}
									</svg>
								</div>
								<h2 className="text-[20px] font-['Sansation'] font-bold text-[#1D2126] dark:text-white mb-4">
									{t("mainMenu.pinCreated")}
								</h2>
								<p className="text-[16px] font-['Sansation'] text-[#6B7280] dark:text-gray-300 mb-8">
									{t("mainMenu.pinCreatedMessage")}
								</p>
								<button
									onClick={() => setShowPinConfirmation(false)}
									className="w-full h-[48px] bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white text-[16px] font-['Sansation'] font-bold rounded-lg hover:opacity-90 transition-opacity">
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
