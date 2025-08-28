import React from "react";
import { FromCurrencyCard } from "./FromCurrencyCard";
import { ToCurrencyCard } from "./ToCurrencyCard";
import { useGetBridgeTokens } from "../../hooks/useBridge";
// import { SwapIcon } from "../Icons/SwapIcon"; // Assuming you have a swap icon component

export const SwapForm = ({
	fromAmount,
	fromCurrency,
	toCurrency,
	setFromAmount,
	toAmount,
	setToAmount,
	setToCurrency,
	setFromCurrency,
}) => {
	// Fetch tokens loading state for the ToCurrencyCard
	const { isLoading: isLoadingTokens } = useGetBridgeTokens({
		limit: 20,
		metadata: "true",
		include_without_price: "true",
	});
	const handleFromAmountChange = (amount) => {
		setFromAmount(amount);

		// Don't calculate here - let the quote from Bridge API provide the exact amount
		// This will be updated when we get the actual quote from thirdweb Bridge
		setToAmount("");
	};


	return (
		<div className="flex flex-col w-full flex-1">
			<div className="relative">
				{/* "From" Currency Input */}
				<FromCurrencyCard
					selectedCurrency={fromCurrency}
					amount={fromAmount}
					onAmountChange={handleFromAmountChange}
					onCurrencySelect={setFromCurrency}
				/>

				{/* "To" Currency Input */}
				<ToCurrencyCard
					selectedCurrency={toCurrency}
					amount={toAmount}
					onCurrencySelect={setToCurrency}
					isLoading={isLoadingTokens}
				/>
			</div>
		</div>
	);
};
