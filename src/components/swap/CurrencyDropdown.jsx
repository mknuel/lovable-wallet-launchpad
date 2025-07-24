import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomSwapTokens } from "../../hooks/useCustomSwapTokens";
import { useActiveAccount } from "thirdweb/react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

export const CurrencyDropdown = ({ isOpen, onClose, onSelect }) => {
	const dropdownRef = useRef(null);
	useOutsideClick(dropdownRef, onClose);
	const activeAccount = useActiveAccount();

	const { ownedTokens: userTokens, isLoading: isGettingTokens } = useCustomSwapTokens();

	const itemVariants = {
		hidden: { opacity: 0, y: -5 },
		visible: (i) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: i * 0.03,
				duration: 0.3,
				ease: [0.22, 1, 0.36, 1],
			},
		}),
	};

	const renderTokenList = () => {
		if (isGettingTokens) {
			return <p className="text-gray-400 text-center p-4">Loading tokens...</p>;
		}

		if (!userTokens || userTokens.length === 0) {
			return <p className="text-gray-400 text-center p-4">No tokens found.</p>;
		}

		return userTokens?.map((currency, i) => {
			const { symbol, value, balance, chain_id, token_address } = currency;
			
			// Determine chain name for display
			const getChainName = (chainId) => {
				switch (chainId) {
					case 137: return "Polygon";
					case 80002: return "Amoy";
					default: return `Chain ${chainId}`;
				}
			};

			const chainName = getChainName(chain_id);
			
			return (
				<motion.div
					key={`${token_address}-${chain_id}`} // Use a truly unique key
					custom={i}
					variants={itemVariants}
					initial="hidden"
					animate="visible"
					whileHover={{ scale: 1.01 }}
					whileTap={{ scale: 0.99 }}
					className="relative p-[1px] mb-2 rounded-lg bg-gradient-to-r from-[#DC2366] to-[#4F5CAA]">
					<button
						onClick={() => onSelect(currency)}
						className="w-full p-3 bg-white hover:bg-gray-50/80 transition-colors rounded-lg text-left">
						<div className="flex justify-between items-center">
							<div className="text-left">
								<div className="flex items-center gap-2 mb-1">
									<div className="font-bold text-lg bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
										{symbol}
									</div>
								</div>
								<div className="text-gray-400 text-sm truncate w-40">
									{token_address}
								</div>
							</div>
							<div className="text-right">
								<div className="font-bold text-lg bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
									{currency?.price_data?.price_usd
										? `${Number(currency?.price_data?.price_usd).toFixed(2)} $`
										: value
										? `${Number(value).toFixed(2)} $`
										: "-"}
								</div>
								<div className="text-gray-400 text-sm">
									{balance ? Number(balance).toFixed(4) : "0.0000"}
								</div>
							</div>
						</div>
					</button>
				</motion.div>
			);
		});
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial="hidden"
					animate="visible"
					exit="exit"
					variants={{
						hidden: { opacity: 0, scale: 0.95, y: -8 },
						visible: {
							opacity: 1,
							scale: 1,
							y: 0,
							transition: { duration: 0.2 },
						},
						exit: {
							opacity: 0,
							scale: 0.97,
							y: -4,
							transition: { duration: 0.2 },
						},
					}}
					className="absolute top-3/4 left-0 right-0 mt-2 z-20 mb-10 shadow-xl"
					ref={dropdownRef}>
					<div className="relative p-[1px] rounded-[10px] bg-gradient-to-r from-[#DC2366] to-[#4F5CAA]">
						<div className="bg-white p-4 rounded-[9px] backdrop-blur-sm bg-opacity-90">
							<motion.p
								className="text-gray-400 text-sm mb-3"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1, transition: { delay: 0.1 } }}>
								Select currency
							</motion.p>
							<div className="max-h-60 overflow-y-auto w-full">
								{renderTokenList()}
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
