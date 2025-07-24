import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/MainHeader";
import { StatsCard } from "../../components/layout/StatsCard";
import { MenuSection } from "../../components/layout/MenuSection";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector, useDispatch } from "react-redux";
import { fetchWallet, selectWalletData, selectWalletLoading, selectWalletError } from '../../store/reducers/walletSlice';
import { PATH_MAIN, PATH_WALLET_ACTIONS } from "../../context/paths";
import CommonButton from "../../components/Buttons/CommonButton";
import { useERC20Token } from "../../hooks/useERC20";

const WalletScreen = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	
	// Use optimized selectors
	const walletData = useSelector(selectWalletData);
	const walletLoading = useSelector(selectWalletLoading);
	const walletError = useSelector(selectWalletError);
	
	// ERC20 token data
	const { balance: erc20Balance, tokenInfo, loading: erc20Loading, formattedBalance } = useERC20Token();

	// Fetch wallet data on component mount - only if not already loading/loaded
	useEffect(() => {
		if (!walletData && !walletLoading) {
			console.log("WalletScreen component mounted, dispatching fetchWallet...");
			dispatch(fetchWallet());
		}
	}, [dispatch, walletData, walletLoading]);

	// Memoize stats data to prevent unnecessary recalculations
	const statsData = useMemo(() => {
		// Format EURX balance to 1 decimal place
		const eurxValue = erc20Loading ? "..." : parseFloat(erc20Balance || '0').toFixed(1);
		
		return [
			{ 
				id: "erc20", 
				value: eurxValue, 
				label: "Tokens" 
			},
			{
				id: "crypto",
				value: walletData?.data?.balance || "0",
				label: t("wallet.crypto"),
			},
			{ id: "loans", value: "0", label: t("wallet.loans") },
		];
	}, [walletData, t, erc20Loading, erc20Balance]);

	// Memoize wallet-specific menu items
	const menuItems = useMemo(() => [
		{
			id: "send",
			label: "Send tokens",
			onClick: () => console.log("Send tokens clicked"),
		},
		{
			id: "exchange",
			label: "Exchange tokens",
			onClick: () => console.log("Exchange tokens clicked"),
		},
		{
			id: "loan",
			label: "Request Loan with your tokens",
			onClick: () => console.log("Request loan clicked"),
		},
	], []);

	const handleNextClick = () => {
		navigate(PATH_WALLET_ACTIONS);
	};

	const handleBackClick = () => {
		navigate(PATH_MAIN);
	};

	return (
		<div className="flex flex-col min-h-screen w-full max-w-full bg-white ">
			{/* Header - Fixed positioning */}
			<div className="w-full sticky top-0 left-0 right-0 z-50 bg-white">
				<Header
					title={t("wallet.title")}
					action={true}
					onBack={handleBackClick}
				/>
			</div>

			{/* Content */}
			<div className="flex-1 flex flex-col px-6 py-8 overflow-hidden mt-3 ">
				{/* Loading State */}
				{walletLoading && (
					<div className="flex justify-center items-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
					</div>
				)}

				{/* Stats Card */}
				{!walletLoading && (
					<div className="w-full mb-6">
						<StatsCard stats={statsData} />
					</div>
				)}

				{/* Menu Section */}
				{!walletLoading && (
					<div className="w-full mb-8">
						<p className="text-center mb-3 break-words">
							You can <strong>Send, Exchange and get</strong> a Loan with your
							tokens!
						</p>
						<MenuSection menuItems={menuItems} />
					</div>
				)}

				{/* Spacer */}
				<div className="flex-1"></div>

				{/* Action Button */}
				<div className="w-full mb-5">
					<CommonButton
						onClick={handleNextClick}
						className="w-full h-[48px] text-[16px] font-['Sansation'] font-bold uppercase tracking-wide
              bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white cursor-pointer hover:opacity-90
              transition-all duration-200 flex items-center justify-center">
						{t("mainMenu.next")}
					</CommonButton>
				</div>
			</div>

			{/* Navigation - Fixed positioning */}
			<div className="w-full sticky bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a]">
				<Navigation nav={t("wallet.title")} />
			</div>
		</div>
	);
};

export default WalletScreen;
