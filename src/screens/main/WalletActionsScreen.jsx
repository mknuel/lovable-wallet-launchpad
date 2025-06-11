
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/MainHeader";
import { StatsCard } from "../../components/layout/StatsCard";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector, useDispatch } from "react-redux";
import { fetchWallet } from '../../store/reducers/walletSlice';
import { PATH_WALLET, PATH_SEND_TOKENS } from "../../context/paths";

const WalletActionsScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { walletData, loading } = useSelector((state) => state.wallet);

  // Fetch wallet data on component mount
  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  // Use real wallet data for stats
  const statsData = walletData?.data
		? [
				{
					id: "tokens",
					value: walletData.data.token || "0",
					label: t("wallet.tokens") || "Tokens",
				},
				{
					id: "crypto",
					value: walletData.data.balance || "0",
					label: t("wallet.crypto") || "Crypto",
				},
				{ id: "loans", value: "0", label: t("wallet.loans") || "Loans" },
		  ]
		: [
				{ id: "tokens", value: "0", label: t("wallet.tokens") || "Tokens" },
				{ id: "crypto", value: "0", label: t("wallet.crypto") || "Crypto" },
				{ id: "loans", value: "0", label: t("wallet.loans") || "Loans" },
		  ];

	const actionOptions = [
		{
			id: "send",
			label:
				t("wallet.actions.send") ||
				"Send your tokens to another DAO member or invite someone by phone to receive them",
			action: () => navigate(PATH_SEND_TOKENS),
		},
		{
			id: "exchange",
			label:
				t("wallet.actions.exchange") ||
				"Exchange your tokens to EURX (€ Euro) or other Cryptocurrency",
			action: () => console.log("Exchange action triggered"),
		},
		{
			id: "loan",
			label: t("wallet.actions.loan") || "Request Loan with your tokens",
			action: () => console.log("Loan action triggered"),
		},
	];

	const handleActionSelect = (option) => {
		console.log("Action selected:", option.id);
		option.action();
	};

	const handleBackClick = () => {
		navigate(PATH_WALLET);
	};

	return (
		<div className="flex flex-col min-h-screen w-full max-w-full bg-white ">
			{/* Header - Fixed positioning */}
			<div className="w-full sticky top-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a]">
				<Header
					title={t("wallet.title") || "My Wallet"}
					action={true}
					onBack={handleBackClick}
				/>
			</div>

			{/* Content */}
			<div className="flex-1 flex flex-col px-6 py-8 overflow-hidden mt-3 mb-[80px]">
				{/* Loading State */}
				{loading && (
					<div className="flex justify-center items-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
					</div>
				)}

				{/* Stats Card */}
				{!loading && (
					<div className="w-full mb-6">
						<StatsCard stats={statsData} />
					</div>
				)}

				{/* Action Options */}
				{!loading && (
					<div className="w-full mb-8 space-y-4">
						{actionOptions.map((option) => (
							<button
								key={option.id}
								onClick={() => handleActionSelect(option)}
								className="w-full max-w-full py-4 px-6 border border-pink-300 dark:border-pink-600 rounded-xl text-pink-600 dark:text-pink-400 font-semibold bg-white  hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 transition-colors text-left">
								{option.label}
							</button>
						))}
					</div>
				)}

				{/* Spacer */}
				<div className="flex-1"></div>
			</div>

			{/* Navigation - Fixed positioning */}
			<div className="w-full sticky bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a]">
				<Navigation nav={"My Wallet"} />
			</div>
		</div>
	);
};

export default WalletActionsScreen;
