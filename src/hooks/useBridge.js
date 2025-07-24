import React, { useState, useEffect } from "react";
import bridge from "../components/thirdweb/thirdwebBridge"; // Adjust path to your axios instance
import axios from "axios";
import qs from "qs";

const CHAIN_IDS = [137, 80002]; // Polygon mainnet and Amoy only
export const useGetBridgeTokens = (params = {}) => {
	const [tokens, setTokens] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// We serialize the params object to use it as a dependency in useEffect.
	// This prevents re-fetching on every render if the parent component passes an object literal.
	const serializedParams = JSON.stringify(params);

	useEffect(() => {
		// Create a controller to cancel the request if the component unmounts
		// or if the params change before the request is complete.
		const controller = new AbortController();

		const fetchTokens = async () => {
			// Reset state for the new request
			setIsLoading(true);
			setError(null);
			setTokens(null);

			try {
				const response = await bridge.get(`/tokens?chain_id=${CHAIN_IDS[0]}&chain_id=${CHAIN_IDS[1]}`, {
					params: JSON.parse(serializedParams), // Use the parsed params for the request
					signal: controller.signal, // Pass the abort signal
				});
				setTokens(response.data.data);
			} catch (err) {
				if (err.name === "CanceledError") {
					// The request was canceled, which is an expected behavior, so we do nothing.
					console.log("Request canceled");
					return;
				}
				// Handle other errors
				console.error("Failed to fetch bridge tokens:", err);
				setError(
					err.response?.data?.error?.message ||
						err.message ||
						"An unknown error occurred"
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTokens();

		// Cleanup function: aborts the fetch request if the component unmounts
		// or if the dependencies change.
		return () => {
			controller.abort();
		};
	}, [serializedParams]); // Effect dependencies

	return { tokens, isLoading, error };
};

// CHAIN_IDS = [59141, 137, 11155111, 1,]
export const useGetAccountTokens = (ownerAddress) => {
	const [tokens, setTokens] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const controller = new AbortController();

		const fetchTokens = async () => {
			setIsLoading(true);
			setError(null);
			setTokens(null);
			// &chain_id=${CHAIN_IDS[1]}&chain_id=${CHAIN_IDS[2]}&chain_id=${CHAIN_IDS[3]}
			try {
				// https://insight.thirdweb.com/v1/tokens?chain_id=1&chain_id=137&chain_id=11155111&limit=50&metadata=false&resolve_metadata_links=true&include_spam=false&owner_address=0xffe11A9c158811FC86fAEdEAA63cD92404B62feD&include_native=true&clientId=YOUR_THIRDWEB_CLIENT_ID
				if (!ownerAddress) throw new Error("No address");
				const response = await bridge.get(
					`https://insight.thirdweb.com/v1/tokens?owner_address=${ownerAddress}&chain_id=${CHAIN_IDS[0]}&chain_id=${CHAIN_IDS[1]}`,
					{
						params: {
							metadata: true,
							include_native: true,
						},
					}
				);

				const processedTokens = response?.data?.data?.map((token) => {
					// Convert the string balance to a number, accounting for decimals
					const balanceAsNumber =
						token.balance && token.decimals
							? parseInt(token.balance, 10) / 10 ** token.decimals
							: 0;

					return {
						...token,
						balance: balanceAsNumber, // Overwrite the string balance with the formatted number
					};
				});
				setTokens(processedTokens);
			} catch (err) {
				if (err.name === "CanceledError") return;
				console.error("Failed to fetch tokens:", err);
				setError(
					err.response?.data?.error?.message ||
						err.message ||
						"An unknown error occurred"
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTokens();

		return () => controller.abort();
	}, [ownerAddress]);

	return { tokens, isLoading, error };
};

// --- Example Usage in a React Component ---
/*
import React from 'react';
import { useBridgeTokens } from './hooks/useBridgeTokens'; // Adjust path

const PolygonTokensList = () => {
  // Pass the filter parameters to the hook
  const { tokens, isLoading, error } = useBridgeTokens({ chainId: 137, limit: 10 });

  if (isLoading) {
    return <div>Loading Polygon tokens...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Top 10 Tokens on Polygon</h1>
      {tokens && tokens.length > 0 ? (
        <ul>
          {tokens.map((token) => (
            <li key={token.tokenAddress}>
              <img src={token.logoUrl} alt={`${token.name} logo`} width="24" height="24" style={{ marginRight: 8 }} />
              {token.name} ({token.symbol})
            </li>
          ))}
        </ul>
      ) : (
        <p>No tokens found.</p>
      )}
    </div>
  );
};
*/
