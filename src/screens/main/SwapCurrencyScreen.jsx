import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/MainHeader";
import SwapProgressNavigation from "../../components/swap/SwapProgressNavigation";
import { useTranslation } from "../../hooks/useTranslation";
import { SwapForm } from "../../components/swap/SwapForm";
import { SecurityMessage } from "../../components/swap/SecurityMessage";
import { PATH_WALLET_ACTIONS } from "../../context/paths";
import { useTheme } from "../../context/ThemeContext";

import { TransactionDetails } from "../../components/swap/TransactionDetails";
import {
	useSendTransaction,
	useActiveAccount,
	useActiveWallet,
	useWalletBalance,
	useEstimateGas,
	useSendAndConfirmTransaction,
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
	estimateGas,
	estimateGasCost,
} from "thirdweb";
import { useGetAccountTokens, useGetBridgeTokens } from "../../hooks/useBridge";
import { useTonWallet } from "@tonconnect/ui-react";
import { balanceOf } from "thirdweb/extensions/erc20";
import CommonButton from "../../components/Buttons/CommonButton";
import {
	ConfirmationModal,
	TransactionSuccessModal,
} from "../../components/swap/ConfirmationModal";
const SwapCurrencyScreen = () => {
	const { t } = useTranslation();
	const activeAccount = useActiveAccount(); // <-- Get the active Account object here
	const navigate = useNavigate();
	const { isDarkMode } = useTheme();
	// State for the swap form
	const [step, setStep] = useState(1);
	const [progressStep, setProgressStep] = useState(1); // For navigation progress
	const [fromCurrency, setFromCurrency] = useState(undefined);
	const [toCurrency, setToCurrency] = useState(undefined);
	const [fromAmount, setFromAmount] = useState("");
	const [toAmount, setToAmount] = useState("");
	const [quote, setQuote] = useState(null);
	const [isFetchingQuote, setIsFetchingQuote] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [error, setError] = useState(null);
	const [isExecutingSwap, setIsExecutingSwap] = useState(false);
	const [gasEstimate, setGasEstimate] = useState(null);

	const [slippage, setSlippage] = useState(0.5);
	// State for tokens the user OWNS
	const [ownedTokens, setOwnedTokens] = useState([]);
	// State for ALL tokens available to swap TO
	const [swappableTokens, setSwappableTokens] = useState([]);
	const { tokens, isLoading: isGetting } = useGetBridgeTokens({
		limit: 10,
	});

	const { tokens: userTokens, isLoading: isGettingTOkens } =
		useGetAccountTokens(activeAccount?.address);

	const { mutate: sendTransaction } = useSendTransaction();
	const { mutate: sendAndConfirmTx } = useSendAndConfirmTransaction();
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
		// Reset progress to from currency selection
		setProgressStep(1);
	};

	// Update progress step based on form state
	useEffect(() => {
		if (fromCurrency && !toCurrency) {
			setProgressStep(2); // Ready to select to currency
		} else if (fromCurrency && toCurrency && !quote) {
			setProgressStep(3); // Ready to get quote
		} else if (quote && !isExecutingSwap) {
			setProgressStep(4); // Ready to execute swap
		} else if (isExecutingSwap) {
			setProgressStep(5); // Transaction in progress
		}
	}, [fromCurrency, toCurrency, quote, isExecutingSwap]);

	// --- Step 1: Get Quote ---
	const handleGetQuote = async (e) => {
		e.preventDefault();
		if (!isStep1Valid || !activeAccount) return;

		setIsFetchingQuote(true);
		setError(null);
		setQuote(null);

		try {
			// Use Bridge.Sell.quote since user specifies how much they want to sell
			const fetchedQuote = await Bridge.Sell.quote({
				originChainId: fromCurrency.chain_id,
				originTokenAddress: fromCurrency.token_address,
				destinationChainId: toCurrency.chainId,
				destinationTokenAddress: toCurrency.address,
				amount: toWei(fromAmount, fromCurrency.decimals || 18),
				client,
			});

			console.log("Quote fetched:", fetchedQuote);
			setQuote(fetchedQuote);

			// Update toAmount from the actual quote
			const step = fetchedQuote.steps[0];
			const toToken = step.destinationToken;
			const actualToAmount =
				Number(fetchedQuote.destinationAmount) / 10 ** toToken.decimals;
			setToAmount(actualToAmount.toFixed(6));

			// Estimate gas for the transactions
			try {
				const prepared = await Bridge.Sell.prepare({
					originChainId: fromCurrency.chain_id,
					originTokenAddress: fromCurrency.token_address,
					destinationChainId: toCurrency.chainId,
					destinationTokenAddress: toCurrency.address,
					amount: toWei(fromAmount, fromCurrency.decimals || 18),
					sender: activeAccount?.address,
					receiver: activeAccount?.address,
					client,
				});

				// Estimate gas for all transactions
				let totalGasEstimate = 0;
				for (const txStep of prepared.steps) {
					for (const transaction of txStep.transactions) {
						const gasEst = await estimateGasCost({
							transaction,
						});

						console.log(gasEst, "gasEst");
						totalGasEstimate = parseFloat(gasEst?.ether)?.toFixed(6) || 0;
						setGasEstimate(totalGasEstimate);
					}
				}
			} catch (gasError) {
				console.warn("Could not estimate gas:", gasError);
				setGasEstimate(null);
			}

			setStep(2); // Move to the confirmation step
		} catch (err) {
			console.error("Failed to get quote:", err);
			setError("Could not retrieve a quote. Please try again.");
		} finally {
			setIsFetchingQuote(false);
		}
	};

	// --- Step 3: Execute Swap ---
	const executeSwap = async () => {
		if (!quote || !activeAccount) return;

		setIsExecutingSwap(true);
		setError(null);

		try {
			console.log(
				fromAmount,
				fromCurrency,
				toCurrency,
				activeAccount,
				"preparing swap"
			);
			const prepared = await Bridge.Sell.prepare({
				originChainId: fromCurrency.chain_id,
				originTokenAddress: fromCurrency.token_address,
				destinationChainId: toCurrency.chainId,
				destinationTokenAddress: toCurrency.address,
				amount: toWei(fromAmount, fromCurrency.decimals || 18),
				sender: activeAccount?.address,
				receiver: activeAccount?.address,
				client,
			});

			console.log("Prepared transactions:", prepared);

			// Execute all transactions and wait for completion
			for (const txStep of prepared.steps) {
				for (const transaction of txStep.transactions) {
					await new Promise((resolve, reject) => {
						sendTransaction(transaction, {
							onSuccess: (result) => {
								console.log("Transaction successful:", result);
								resolve(result);
							},
							onError: (error) => {
								console.error("Transaction failed:", error);
								reject(error);
							},
						});
					});
				}
			}

			console.log("All transactions completed successfully!");
			setIsModalOpen(true);
		} catch (err) {
			console.error("Failed to execute swap:", err);
			setError("An error occurred during the swap.");
		} finally {
			setIsExecutingSwap(false);
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
		console.log("quote", quote);
	}, [quote]);

	return (
		<div className={`flex flex-col min-h-screen w-full max-w-full ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-white text-black'}`}>
			{/* Header - Fixed positioning */}
			<div className={`w-full sticky top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
				<Header title="Swap" action={true} onBack={handleBackClick} />
			</div>

			{isLoadingNativeBalance && <h1>Loadinf native</h1>}
			{/* Content */}
			<div className="flex-1 flex flex-col px-6 py-4 overflow-hidden pb-32">
				<SwapForm
					fromAmount={fromAmount}
					setFromAmount={setFromAmount}
					toAmount={toAmount}
					setToAmount={setToAmount}
					fromCurrency={fromCurrency}
					setFromCurrency={setFromCurrency}
					toCurrency={toCurrency}
					setToCurrency={setToCurrency}
				/>

				{step === 2 && (
					<TransactionDetails
						slippage={slippage}
						setSlippage={setSlippage}
						details={quote}
						gasEstimate={gasEstimate}
					/>
				)}
				{error && (
					<p className={`text-red-500 w-full rounded p-3 text-sm text-center mt-2 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-100'}`}>
						{error}
					</p>
				)}

				<div className={`mt-auto pt-8 ${step == 1 && "pt-28"}`}>
					{step === 1 && (
						<CommonButton
							onClick={handleGetQuote}
							className="w-full !text-[#fff] py-3 uppercase"
							disabled={!isStep1Valid || isFetchingQuote}>
							{isFetchingQuote ? "Getting Quote..." : "NEXT"}
						</CommonButton>
					)}
					{step === 2 && (
						<CommonButton
							type="button"
							className="w-full !text-[#fff] py-3 uppercase"
							onClick={executeSwap}
							disabled={!quote || isExecutingSwap}>
							{isExecutingSwap ? "Processing..." : "NEXT"}
						</CommonButton>
					)}
				</div>
				<div className="mt-6">
					<SecurityMessage />
				</div>
			</div>

			<TransactionSuccessModal
				isOpen={isModalOpen && !isExecutingSwap}
				onClose={() => setIsModalOpen(false)}
				onConfirm={() => setIsModalOpen(false)}
				isLoading={isExecutingSwap}
			/>

			{/* Progress Navigation - Fixed to bottom */}
			<div className={`sticky w-full bottom-0 left-0 right-0 z-50 border-t ${isDarkMode ? 'bg-[#1a1a1a] border-gray-600' : 'bg-white border-gray-200'}`}>
				<SwapProgressNavigation
					currentStep={progressStep}
					onStepClick={(stepId) => {
						// Allow navigation only to completed or current steps
						if (stepId <= progressStep) {
							if (stepId === 1) {
								setStep(1);
								setQuote(null);
								setToAmount("");
							} else if (stepId === 2 && fromCurrency) {
								setStep(1);
							} else if (stepId === 3 && fromCurrency && toCurrency) {
								setStep(1);
							}
						}
					}}
				/>
			</div>
		</div>
	);
};

export default SwapCurrencyScreen;
