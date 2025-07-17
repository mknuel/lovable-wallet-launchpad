import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { PATH_WALLET_ACTIONS } from "../../context/paths";
import api from "../../utils/api";
import Header from "../../components/layout/MainHeader";
import SearchIcon from "../../assets/icons/Search.svg";
import { FromCurrencyCard } from "../../components/swap/FromCurrencyCard";
import { defineChain, getContract, NATIVE_TOKEN_ADDRESS, estimateGas, toWei } from "thirdweb";
import { client } from "../../components/thirdweb/thirdwebClient";
import {
	useActiveAccount,
	useEstimateGas,
	useSendTransaction,
	useSimulateTransaction,
} from "thirdweb/react";
import { transfer } from "thirdweb/extensions/erc20";
import { SendConfirmationModal } from "../../components/swap/ConfirmationModal";
import CommonButton from "../../components/Buttons/CommonButton";

function formatTokenBalance(token) {
	if (
		!token ||
		typeof token.balance !== "number" ||
		typeof token.symbol !== "string"
	) {
		return `--`;
	}

	const { balance, symbol, price_data } = token;

	if (price_data && typeof price_data.price_usd === "number") {
		const usdValue = balance * price_data.price_usd;
		return `$${usdValue.toFixed(2)}`;
	}

	return `${balance} ${symbol}`;
}

function formatGasFee(gasEstimate, fromCurrency) {
	if (!gasEstimate || !fromCurrency) return "--";

	// Convert BigInt gas estimate from wei to native token
	const gasInWei = BigInt(gasEstimate);
	const gasInNative = Number(gasInWei) / 10**18;
	const nativeTokenPrice = fromCurrency.price_data?.price_usd || 3500; // Fallback price
	const gasInUsd = gasInNative * nativeTokenPrice;

	return `${gasInNative.toFixed(6)} ETH ($${gasInUsd.toFixed(2)})`;
}

const SendTokensScreen = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [amount, setAmount] = useState("");
	const [showAmountInput, setShowAmountInput] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [fromCurrency, setFromCurrency] = useState(undefined);
	const [operationStatus, setOperationStatus] = useState(null); // 'searching', 'estimating', 'sending'
	const [isOpen, setIsOpen] = useState(false);
	const [gasEstimate, setGasEstimate] = useState(null);

	const activeAccount = useActiveAccount();
	const { mutate: sendTransaction } = useSendTransaction();
	const { mutate: estimateGasForTx, data: gasCost } = useEstimateGas();
	const [preparedTx, setPreparedTx] = useState();
	const activeRequest = useRef(null);
	const lastSearchQuery = useRef("");
	const { mutate: simulateTx } = useSimulateTransaction();

	const debounceSearch = useCallback(
		debounce((query) => {
			handleUserSearch(query);
		}, 500),
		[]
	);

	useEffect(() => {
		handleUserSearch("");
	}, []);

	useEffect(() => {
		debounceSearch(searchQuery);
	}, [searchQuery, debounceSearch]);

	const handleUserSearch = async (query) => {
		if (query !== lastSearchQuery.current) {
			lastSearchQuery.current = query;
		} else if (activeRequest.current) {
			return;
		}

		try {
			setOperationStatus(query.trim() ? "searching" : "loading");

			const endpoint = query.trim()
				? `/users/by/name?name=${encodeURIComponent(query)}`
				: "/users";

			activeRequest.current = api.get(endpoint);
			const response = await activeRequest.current;

			let activeUsers = [];

			if (response.data && Array.isArray(response.data)) {
				activeUsers = response.data
					.filter((user) => {
						const status = user.status || user.userBasicDetails?.status;
						return status === "active";
					})
					.map((user) => {
						const userName = user.userName || "";
						const firstName =
							user.firstName || user.userProfileDetails?.firstName || "";
						const lastName =
							user.lastName || user.userProfileDetails?.lastName || "";
						const email = user.email || user.userBasicDetails?.email || "";
						const phone = user.phone || user.userBasicDetails?.phone || "";

						let name;
						if (userName) {
							name = userName;
						} else if (firstName || lastName) {
							name = `${firstName} ${lastName}`.trim();
						} else {
							name = phone || "Unknown User";
						}

						return {
							id: user._id,
							name: name,
							firstName: firstName,
							lastName: lastName,
							email: email,
							phone: phone,
							avatar: "",
							walletAddress:
								user?.walletAddress ||
								"0x538b7442ec68E1fcDA65818104d4b46ccB74CDEF",
						};
					});
			}

			setUsers(activeUsers);
		} catch (error) {
			console.error("Error fetching users:", error);
			setUsers([]);
		} finally {
			activeRequest.current = null;
			setOperationStatus(null);
		}
	};

	const handleUserSelect = (user) => {
		setSelectedUser(user);
		setShowAmountInput(true);
	};

	const handleSendTokens = useCallback(async () => {
		if (!preparedTx) {
			console.error("Missing required information for transaction.");
			return;
		}

		try {
			setOperationStatus("sending");

			const result = await simulateTx(preparedTx);

			console.log(result, "res");
			/* sendTransaction(preparedTx, {
				onSuccess: (result) => {
					console.log("Transaction successful:", result);
					navigate(PATH_WALLET_ACTIONS);
				},
				onError: (error) => {
					console.error("Transaction failed:", error);
				},
				onSettled: () => {
					setOperationStatus(null);
				},
			}); */
		} catch (error) {
			console.error("Error preparing transaction:", error);
			setOperationStatus(null);
		}
	}, [preparedTx, navigate, sendTransaction, simulateTx]);

	const handleBackClick = () => {
		if (showAmountInput) {
			setShowAmountInput(false);
			setSelectedUser(null);
			setAmount("");
		} else {
			navigate(PATH_WALLET_ACTIONS);
		}
	};

	useEffect(() => {
		const prepareTransaction = async () => {
			if (
				amount &&
				parseFloat(amount) > 0 &&
				fromCurrency &&
				selectedUser &&
				activeAccount &&
				fromCurrency.token_address &&
				fromCurrency.chain_id
			) {
				try {
					setOperationStatus("estimating");

					const chain = defineChain({ id: fromCurrency?.chain_id });
					const contract = getContract({
						client,
						chain,
						address: fromCurrency.token_address,
					});

					const tx = transfer({
						contract,
						to: "0x538b7442ec68E1fcDA65818104d4b46ccB74CDEF",
						amount: amount,
					});

					setPreparedTx(tx);
					
					// Estimate gas for the transaction
					try {
						const gas = await estimateGas({
							transaction: tx,
							from: activeAccount?.address,
						});
						setGasEstimate(gas);
					} catch (gasError) {
						console.warn("Could not estimate gas:", gasError);
						setGasEstimate(null);
					}
				} catch (e) {
					console.error("Error preparing transaction for estimation:", e);
					setPreparedTx(null);
				} finally {
					setOperationStatus(null);
				}
			} else {
				setPreparedTx(null);
			}
		};

		prepareTransaction();
	}, [amount, fromCurrency, selectedUser, activeAccount, estimateGasForTx]);

	const isLoading = operationStatus !== null;
	const isSendDisabled =
		!amount || isLoading || !preparedTx || operationStatus == "estimating";

	return (
		<div className="flex flex-col min-h-screen w-full max-w-full bg-white">
			<div className="w-full sticky top-0 left-0 right-0 z-50 bg-white">
				<Header
					title={t("wallet.title") || "My Wallet"}
					action={true}
					onBack={handleBackClick}
				/>
			</div>

			<SendConfirmationModal
				isOpen={isOpen}
				onConfirm={handleSendTokens}
				onClose={() => setIsOpen(false)}
			/>

			<div className="flex-1 flex flex-col px-5 py-3 overflow-hidden mt-3">
				{!showAmountInput ? (
					<>
						<div className="w-full mb-6">
							<div className="relative">
								<input
									type="text"
									placeholder="Search by name..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
								/>
								<div className="absolute left-4 top-1/2 transform -translate-y-1/2">
									<img src={SearchIcon} alt="Search" />
								</div>
								{operationStatus === "searching" && (
									<div className="absolute right-4 top-1/2 transform -translate-y-1/2">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
									</div>
								)}
							</div>
						</div>

						<div className="w-full flex-1 overflow-y-auto">
							{operationStatus === "searching" ||
							(operationStatus == "loading" && users.length === 0) ? (
								<div className="text-center py-8">Loading users...</div>
							) : users.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									{searchQuery
										? "No active users found matching your search"
										: "No active users available"}
								</div>
							) : (
								<div className="space-y-4">
									{users?.map((user) => (
										<button
											key={user.id}
											onClick={() => handleUserSelect(user)}
											className="w-full flex items-center py-2 px-1 bg-white hover:bg-gray-50 transition-colors text-left border-b border-gray-100">
											<img
												src={user.avatar}
												alt={user.name}
												className="w-12 h-12 rounded-full object-cover mr-4"
											/>
											<div className="flex-1">
												<h3 className="text-lg capitalize font-semibold text-gray-900">
													{user.name}
												</h3>
												<p className="text-sm text-gray-500">Contact</p>
											</div>
											<div className="text-gray-400">
												<svg
													className="w-6 h-6"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
													/>
												</svg>
											</div>
										</button>
									))}
								</div>
							)}
						</div>
					</>
				) : (
					<>
						<section
							className={`relative w-full max-w-full mx-auto text-white stats-box rounded-xl`}
							role="region"
							aria-label="Currency balance text-white">
							<div className="relative flex items-center h-full px-6 flex-col p-5">
								<h2 className="font-semibold text-4xl">
									{formatTokenBalance(fromCurrency)}
								</h2>
								<div className="flex flex-col items-center w-full max-w-sm mt-4 text-sm gap-2">
									<div className="justify-between flex w-full">
										<span>From:</span>
										<span>{fromCurrency?.symbol || "--"}</span>
									</div>
									<div className="justify-between flex w-full">
										<span>Available Balance:</span>
										<span>
											{fromCurrency?.balance} {fromCurrency?.symbol || "--"}
										</span>
									</div>
									<div className="justify-between flex w-full">
										<span>Network Fee:</span>
										<span>{formatGasFee(gasEstimate, fromCurrency)}</span>
									</div>
								</div>
							</div>
						</section>

						<FromCurrencyCard
							selectedCurrency={fromCurrency}
							amount={amount}
							onAmountChange={setAmount}
							onCurrencySelect={setFromCurrency}
						/>

						<div className="w-full mb-6 mt-5 py-2 px-4 bg-white border border-gray-300 rounded-2xl">
							<div className="text-gray-400">Send To:</div>
							<div className="flex items-center">
								<img
									src={selectedUser.avatar}
									alt={selectedUser.name}
									className="w-12 h-12 rounded-full object-cover mr-4"
								/>
								<div>
									<h3 className="text-lg font-semibold text-gray-900">
										{selectedUser.name}
									</h3>
									<p className="text-sm text-gray-400 font-normal">
										Selected recipient
									</p>
								</div>
							</div>
						</div>

						<div className="flex-1"></div>

						<div className="w-full mb-5">
							<CommonButton
								onClick={() => setIsOpen(true)}
								disabled={isSendDisabled}
								className="w-full !text-[#fff] py-3 uppercase">
								{operationStatus === "sending"
									? "Sending..."
									: operationStatus === "estimating"
									? "Calculating..."
									: "SEND TOKENS"}
							</CommonButton>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

export default SendTokensScreen;
