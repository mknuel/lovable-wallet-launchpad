import { useState, useEffect } from "react";
import axios from "axios";

// Simple bridge hooks without complex dependencies
const THIRDWEB_CLIENT_ID = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

const bridgeClient = axios.create({
	baseURL: "https://bridge.thirdweb.com/v1/",
	headers: {
		"Content-Type": "application/json",
		"x-client-id": THIRDWEB_CLIENT_ID,
	},
});

export const useSimpleBridgeTokens = (params = {}) => {
	const [tokens, setTokens] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchTokens = async () => {
			try {
				setIsLoading(true);
				setError(null);
				
				const response = await bridgeClient.get('/tokens?chain_id=137&chain_id=80002', {
					params: {
						limit: params.limit || 20,
						metadata: true,
					}
				});
				
				setTokens(response.data.data);
			} catch (err) {
				console.error("Failed to fetch bridge tokens:", err);
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTokens();
	}, [params.limit]);

	return { tokens, isLoading, error };
};

export const useSimpleAccountTokens = (ownerAddress) => {
	const [tokens, setTokens] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!ownerAddress) return;

		const fetchTokens = async () => {
			try {
				setIsLoading(true);
				setError(null);
				
				const response = await axios.get(
					`https://insight.thirdweb.com/v1/tokens?owner_address=${ownerAddress}&chain_id=137&chain_id=80002`,
					{
						params: {
							metadata: true,
							include_native: true,
						},
						headers: {
							'x-client-id': THIRDWEB_CLIENT_ID,
						}
					}
				);

				const processedTokens = response?.data?.data?.map((token) => {
					const balanceAsNumber = token.balance && token.decimals
						? parseInt(token.balance, 10) / 10 ** token.decimals
						: 0;

					return {
						...token,
						balance: balanceAsNumber,
					};
				});
				
				setTokens(processedTokens);
			} catch (err) {
				console.error("Failed to fetch account tokens:", err);
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTokens();
	}, [ownerAddress]);

	return { tokens, isLoading, error };
};