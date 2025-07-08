import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/MainHeader";
import { SwapBottomNavigation } from "../../components/swap/SwapBottomNavigation";
import { useTranslation } from "../../hooks/useTranslation";
import { SwapForm } from "../../components/swap/SwapForm";
import { SecurityMessage } from "../../components/swap/SecurityMessage";
import { PATH_WALLET_ACTIONS } from "../../context/paths";

import { TransactionDetails } from "../../components/swap/TransactionDetails";
import {
	useSendTransaction,
	useActiveAccount,
	useActiveWallet,
	useWalletBalance,
	useEstimateGasCost,
} from "thirdweb/react";
import { useWalletAccount } from "../../context/WalletAccountContext";
import { client } from "../../components/thirdweb/thirdwebClient";
import { sepolia } from "thirdweb/chains";

import {
	NATIVE_TOKEN_ADDRESS,
	Bridge,
	Insight,
	getContract,
	sendTransaction,
	toWei,
} from "thirdweb";
import { useGetAccountTokens, useGetBridgeTokens } from "../../hooks/useBridge";
import { useTonWallet } from "@tonconnect/ui-react";
import { balanceOf } from "thirdweb/extensions/erc20";
import CommonButton from "../../components/Buttons/CommonButton";
import { ConfirmationModal } from "../../components/swap/ConfirmationModal";
const SwapCurrencyScreen = () => {
	const { t } = useTranslation();
	const activeAccount = useActiveAccount(); // <-- Get the active Account object here
	const navigate = useNavigate();
	// State for the swap form
	const [step, setStep] = useState(1);
	const [fromCurrency, setFromCurrency] = useState(undefined);
	const [toCurrency, setToCurrency] = useState(undefined);
	const [fromAmount, setFromAmount] = useState("");
	const [toAmount, setToAmount] = useState("");
	const [quote, setQuote] = useState(null);
	const [isFetchingQuote, setIsFetchingQuote] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [error, setError] = useState(null);
	const { mutate: estimateGasCost, data: gasCost } = useEstimateGasCost();

	// State for tokens the user OWNS
	const [ownedTokens, setOwnedTokens] = useState([]);
	// State for ALL tokens available to swap TO
	const [swappableTokens, setSwappableTokens] = useState([]);
	const { tokens, isLoading: isGetting } = useGetBridgeTokens({
		limit: 10,
	});

	const { tokens: userTokens, isLoading: isGettingTOkens } =
		useGetAccountTokens(activeAccount?.address);

	const tonwal = useTonWallet();

	const { mutate: sendTransaction } = useSendTransaction();
	const [isLoading, setIsLoading] = useState(true);
	const activeWallet = useActiveWallet(); // <-- Get the active Wallet object here (useful for some wallet-specific methods)

	// Derive the active chain from the connected wallet or set a default
	const chain = activeWallet ? activeWallet.getChain() : sepolia;

	// --- Fetch User's Token Balances ---
	// You can use useWalletBalance for the native token
	const { data: nativeBalance, isLoading: isLoadingNativeBalance } =
		useWalletBalance({
			client,
			chainId: [59141, 137, 11155111, 1],
			address: activeAccount?.address,
		});

	// Function to fetch a specific ERC20 token balance
	const { mutate: fetchTokenBalance } = useWalletBalance({
		client,
		chain,
		address: activeAccount?.address,
	});

	useEffect(() => {
		console.log("active acct:", activeAccount);
		console.log("active wallet:", activeWallet);
		return () => {};
	}, [activeAccount, activeWallet]);

	const handleSwapCurrencies = () => {
		setFromCurrency(toCurrency);
		setToCurrency(fromCurrency);
		setQuote(null);
		setToAmount("");
		if (step === 2) setStep(1);
	};

	// --- Step 1: Get Quote ---
	const handleGetQuote = async (e) => {
		e.preventDefault();
		if (!isStep1Valid || !activeAccount) return;

		setIsFetchingQuote(true);
		setError(null);
		setQuote(null);

		try {
			const fetchedQuote = await Bridge.Buy.quote({
				originChainId: fromCurrency.chain_id,
				originTokenAddress: fromCurrency.token_address,
				destinationChainId: toCurrency.chainId,
				destinationTokenAddress: toCurrency.address,
				amount: toWei(fromAmount, fromCurrency.decimals),
				client,
			});

			const qt = await estimateGasCost(fetchedQuote);
			console.log(qt, "quote");
			setQuote(fetchedQuote, fetchedQuote.approval, "approval");
			setStep(2); // Move to the confirmation step
		} catch (err) {
			console.error("Failed to get quote:", err);
			setError("Could not retrieve a quote. Please try again.");
		} finally {
			setIsFetchingQuote(false);
		}
	};

	// --- Step 2: Open Confirmation Modal ---
	const handleConfirmClick = () => {
		if (step === 2 && quote) {
			setIsModalOpen(true);
		}
	};

	// --- Step 3: Execute Swap ---
	const executeSwap = async () => {
		if (!quote || !activeAccount) return;
		setIsModalOpen(false);

		try {
			console.log(fromAmount, fromCurrency, toCurrency, activeAccount, "shad");
			const prepared = await Bridge.Buy.prepare({
				originChainId: fromCurrency.chain_id,
				originTokenAddress: fromCurrency.token_address,
				destinationChainId: toCurrency.chainId,
				destinationTokenAddress: toCurrency.address,
				amount: toWei(fromAmount),
				sender: activeAccount?.address,
				receiver: activeAccount?.address,
				client,
			});

			console.log(prepared, "prepared");
			for (const txStep of prepared.steps) {
				for (const transaction of txStep.transactions) {
					await sendTransaction(transaction);
				}
			}
			console.log("Swap executed successfully!");
			// navigate(PATH_WALLET_ACTIONS);
		} catch (err) {
			console.error("Failed to execute swap:", err);
			setError("An error occurred during the swap.");
		}
	};

	const handleBackClick = () => {
		if (step === 2) {
			setStep(1);
			setQuote(null);
			setToAmount("");
			setError(null);
		} else {
			navigate(PATH_WALLET_ACTIONS);
		}
	};

	const isStep1Valid =
		fromCurrency && toCurrency && fromAmount && parseFloat(fromAmount) > 0;

	useEffect(() => {
		console.log("tokens", tokens);
	}, [tokens]);
	useEffect(() => {
		console.log("bative ball", nativeBalance);
	}, [nativeBalance]);

	useEffect(() => {
		console.log("tonative ball", userTokens);
	}, [userTokens]);
	useEffect(() => {
		console.log("quote", quote);
	}, [quote]);

	useEffect(() => {
		console.log("gascost", gasCost);
	}, [gasCost]);

	return (
		<div className="flex flex-col min-h-screen w-full max-w-full bg-white">
			{/* Header - Fixed positioning */}
			<div className="w-full sticky top-0 left-0 right-0 z-50 bg-white">
				<Header title="Swap" action={true} onBack={handleBackClick} />
			</div>

			{isLoadingNativeBalance && <h1>Loadinf native</h1>}
			{/* Content */}
			<div className="flex-1 flex flex-col px-6 py-4 overflow-hidden pb-32">
				<SwapForm
					fromAmount={setFromAmount}
					setFromAmount={setFromAmount}
					toAmount={toAmount}
					setToAmount={setToAmount}
					fromCurrency={fromCurrency}
					setFromCurrency={setFromCurrency}
					toCurrency={toCurrency}
					setToCurrency={setToCurrency}
				/>

				{step === 2 && <TransactionDetails details={quote} />}
				{error && (
					<p className="text-red-500 text-sm text-center mt-2">{error}</p>
				)}

				<div className="mt-auto pt-8">
					{step === 1 && (
						<CommonButton
							onClick={handleGetQuote}
							className="w-full !text-[#fff] py-3"
							disabled={!isStep1Valid || isFetchingQuote}>
							{isFetchingQuote ? "Getting Quote..." : "Get Quote"}
						</CommonButton>
					)}
					{step === 2 && (
						<CommonButton
							type="button"
							className="w-full !text-[#fff] py-3"
							onClick={handleConfirmClick}
							disabled={!quote}>
							Confirm Swap
						</CommonButton>
					)}
				</div>
				<div className="mt-6">
					<SecurityMessage />
				</div>
			</div>

			<ConfirmationModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={executeSwap}
			/>

			{/* Bottom Navigation - Fixed to bottom */}
			<div className="sticky w-full bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
				<SwapBottomNavigation
					items={[
						{
							id: "messages",
							icon: "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/ce980df59d2e45dfb2487bd1a267aa68c36d3c53?placeholderIfAbsent=true",
							label: "Messages",
							onClick: () => handleNavigation("messages"),
						},
						{
							id: "dial1",
							icon: "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/03214bd6d68edcb29752f62522e6e5d597d50a77?placeholderIfAbsent=true",
							label: "Dial",
							onClick: () => handleNavigation("dial1"),
						},
						{
							id: "dial2",
							icon: "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/44f4a511f05e8c6b1ae70f88f11a8032039468d4?placeholderIfAbsent=true",
							label: "Dial",
							onClick: () => handleNavigation("dial2"),
						},
						{
							id: "dial3",
							icon: "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/9ef795a7e666f34dfeea6d31613d944f0b087e8c?placeholderIfAbsent=true",
							label: "Dial",
							onClick: () => handleNavigation("dial3"),
						},
						{
							id: "dial4",
							icon: "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/34f0183867c6f73a05b1fb8d01546f290af7320b?placeholderIfAbsent=true",
							label: "Dial",
							onClick: () => handleNavigation("dial4"),
						},
						{
							id: "contact",
							icon: "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/1feb2a6cba270cf15db25be6dab70b3c838d28fe?placeholderIfAbsent=true",
							label: "Contact",
							onClick: () => handleNavigation("contact"),
						},
					]}
				/>
			</div>
		</div>
	);
};

export default SwapCurrencyScreen;
