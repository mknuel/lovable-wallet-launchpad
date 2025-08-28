import React, { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { usePolygonTokens } from "../../hooks/usePolygonTokens";
import useDebounce from "../../hooks/useDebounce";
import Search from "../../assets/icons/Search.svg";
import Nodata from "../../assets/icons/cancel.svg";
import { useTheme } from "../../context/ThemeContext";

export const SearchableCurrencyDropdown = ({
	isOpen,
	onClose,
	onSelect,
}) => {
	const dropdownRef = useRef(null);
	const [search, setSearch] = useState("");
	const debouncedSearchTerm = useDebounce(search, 300); // 300ms debounce
	const { isDarkMode } = useTheme();

	const { availableTokens, isLoading } = usePolygonTokens();
	
	// Filter tokens based on search
	const tokens = availableTokens?.filter(token => {
		if (!debouncedSearchTerm) return true;
		const searchLower = debouncedSearchTerm.toLowerCase();
		return (
			token.symbol?.toLowerCase().includes(searchLower) ||
			token.name?.toLowerCase().includes(searchLower)
		);
	}) || [];
	
	const error = null;

	useOutsideClick(dropdownRef, onClose);

	// Animation variants (unchanged)
	const dropdownVariants = {
		hidden: {
			opacity: 0,
			scale: 0.95,
			y: -8,
			transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
		},
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				duration: 0.4,
				ease: [0.32, 0, 0.67, 0],
				scale: { type: "spring", damping: 12, stiffness: 200 },
			},
		},
		exit: {
			opacity: 0,
			scale: 0.97,
			y: -4,
			transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
		},
	};
	const itemVariants = {
		hidden: { opacity: 0, y: -5 },
		visible: (i) => ({
			opacity: 1,
			y: 0,
			transition: { delay: i * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
		}),
	};
	const noResultsVariants = {
		hidden: { opacity: 0, scale: 0.95 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
		},
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					variants={dropdownVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					className="absolute top-3/4 left-0 right-0 mt-2 z-20 mb-10 shadow-xl"
					ref={dropdownRef}>
					<div className="relative p-[1px] w-full rounded-[8px] bg-gradient-to-r from-[#DC2366] to-[#4F5CAA]">
						<div className={`p-4 rounded-[8px] backdrop-blur-sm bg-opacity-90 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
							<p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>Select currency</p>

							{/* Search input */}
							<div className="relative mb-4">
								<div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
									<img src={Search} className="w-5 h-5" alt="Search" />
								</div>
								<input
									type="text"
									value={search} // Bind to the immediate search state
									onChange={(e) => setSearch(e.target.value)} // Update the immediate state
									placeholder="Search name or symbol"
									className={`w-full pl-10 pr-3 py-3 border outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 rounded-lg transition-all ${
										isDarkMode 
											? 'border-gray-600 bg-[#2a2a2a] text-white placeholder-gray-500' 
											: 'border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400'
									}`}
								/>
							</div>

							<div className="max-h-60 overflow-y-auto">
								{isLoading && (
									<div className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
										Searching...
									</div>
								)}
								{error && (
									<div className="text-center py-4 text-red-500">
										Error: {error}
									</div>
								)}

								{!isLoading &&
									!error &&
									(tokens && tokens.length > 0 ? (
										tokens.map((token, i) => (
											<motion.div
												key={`${token.address}-${token.chainId}`}
												custom={i}
												variants={itemVariants}
												initial="hidden"
												animate="visible"
												whileHover={{ scale: 1.01 }}
												whileTap={{ scale: 0.99 }}
												className="relative p-[1px] mb-2 rounded-lg bg-gradient-to-r from-pink-500 to-violet-500">
												<button
													onClick={() => {
														onSelect(token);
														onClose();
													}}
													className={`w-full p-3 transition-colors rounded-lg text-left ${
														isDarkMode 
															? 'bg-[#1a1a1a] hover:bg-[#2a2a2a]' 
															: 'bg-white hover:bg-gray-50'
													}`}>
													<div className="flex justify-between items-center">
														<div className="flex items-center gap-3">
															{token.iconUri && (
																<img
																	src={token.iconUri}
																	alt={token.name}
																	className="w-8 h-8 rounded-full"
																/>
															)}
															<div className="text-left">
																<div className="font-bold text-lg bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
																	{token.symbol}
																</div>
																<div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
																	{token.name}
																</div>
															</div>
														</div>

														{/* Display the price from the API if it exists */}
														{token.priceUsd && (
															<div className={`text-right font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
																${Number(token.priceUsd).toFixed(2)}
															</div>
														)}
													</div>
												</button>
											</motion.div>
										))
									) : (
										<motion.div
											variants={noResultsVariants}
											initial="hidden"
											animate="visible"
											className="flex flex-col items-center justify-center py-4">
											<img src={Nodata} />
											<div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
												No tokens found
											</div>
										</motion.div>
									))}
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
