import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/MainHeader";
import { StatsCard } from "../../components/layout/StatsCard";
import { MenuSection } from "../../components/layout/MenuSection";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector, useDispatch } from "react-redux";
import {
	fetchWallet,
	selectWalletData,
	selectWalletLoading,
	selectWalletError,
} from "../../store/reducers/walletSlice";
import { PATH_MAIN, PATH_WALLET_ACTIONS } from "../../context/paths";
import CommonButton from "../../components/Buttons/CommonButton";
import { useERC20Token } from "../../hooks/useERC20";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import { useTheme } from "../../context/ThemeContext"; // Import the theme context

const WalletScreen = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isDarkMode } = useTheme(); // Use the theme context

	// Use optimized selectors
	const walletData = useSelector(selectWalletData);
	const walletLoading = useSelector(selectWalletLoading);

	// Token balance from API and EURX (crypto) balance
	const {
		loading: tokenLoading,
		formattedBalance: formattedTokenBalance,
	} = useTokenBalance();
	const {
		balance: erc20Balance,
		loading: erc20Loading,
	} = useERC20Token();

	// Fetch wallet data on component mount - only if not already loading/loaded
	useEffect(() => {
		if (!walletData && !walletLoading) {
			console.log("WalletScreen component mounted, dispatching fetchWallet...");
			dispatch(fetchWallet());
		}
	}, [dispatch, walletData, walletLoading]);

	// Memoize stats data to prevent unnecessary recalculations
	const statsData = useMemo(() => {
		// Token balance from API
		const tokenValue = tokenLoading ? "..." : formattedTokenBalance;
		// EURX balance as crypto
		const eurxValue = erc20Loading
			? "..."
			: parseFloat(erc20Balance || "0").toFixed(1);

		return [
			{
				id: "token",
				value: tokenValue,
				label: "Tokens",
			},
			{
				id: "crypto",
				value: eurxValue,
				label: t("wallet.crypto"),
			},
			{ id: "loans", value: "0", label: t("wallet.loans") },
		];
	}, [tokenLoading, formattedTokenBalance, erc20Loading, erc20Balance, t]);

	// Memoize wallet-specific menu items
	const menuItems = useMemo(
		() => [
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
		],
		[]
	);

	const handleNextClick = () => {
		navigate(PATH_WALLET_ACTIONS);
	};

	const handleBackClick = () => {
		navigate(PATH_MAIN);
	};

	// Dynamic classes based on theme
	const containerClasses = `flex flex-col min-h-screen w-full max-w-full ${
		isDarkMode ? "bg-[#1a1a1a] text-white" : "bg-white text-black"
	}`;

	const headerClasses = `w-full sticky top-0 left-0 right-0 z-50 ${
		isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
	}`;

	const navigationClasses = `w-full sticky bottom-0 left-0 right-0 z-50 ${
		isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
	}`;

	const loadingSpinnerClasses = `animate-spin rounded-full h-8 w-8 border-b-2 ${
		isDarkMode ? "border-pink-400" : "border-pink-600"
	}`;

	const descriptionTextClasses = `text-center mb-3 break-words ${
		isDarkMode ? "text-gray-200" : "text-black"
	}`;

	return (
		<div className={containerClasses}>
			{/* Header - Fixed positioning */}
			<div className={headerClasses}>
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
						<div className={loadingSpinnerClasses}></div>
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
						<p className={descriptionTextClasses}>
							You can <strong>Send, Exchange and get</strong> a Loan with your
							tokens!
						</p>
						<MenuSection menuItems={menuItems} uppercase />
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
			<div className={navigationClasses}>
				<Navigation nav={t("wallet.title")} />
			</div>
		</div>
	);
};

export default WalletScreen;
