import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import Search from "../../assets/icons/Search.svg";
const mockTokens = [
	{
		symbol: "EARN",
		name: "Earn Token",
		balance: 1500.0,
		value: 2000.0,
		address: "0xG97...g7R4",
	},
	{
		symbol: "LOAN",
		name: "Loan Token",
		balance: 1500.0,
		value: 2000.0,
		address: "0xG97...g7R4",
	},
	{
		symbol: "RIDE",
		name: "Ride Token",
		balance: 1500.0,
		value: 2000.0,
		address: "0xG97...g7R4",
	},
	{
		symbol: "EURX",
		name: "Euro X",
		balance: 1500.0,
		value: 2000.0,
		address: "0xG97...g7R4",
	},
	{
		symbol: "MUDI",
		name: "Mudi Token",
		balance: 1500.0,
		value: 2000.0,
		address: "0xG97...g7R4",
	},
];

export const SearchableCurrencyDropdown = ({
	isOpen,
	onClose,
	onSelect,
	searchTerm,
	onSearchChange,
}) => {
	const dropdownRef = useRef(null);
	const [filteredTokens, setFilteredTokens] = useState(mockTokens);
	useOutsideClick(dropdownRef, onClose);

	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			if (searchTerm.trim() === "") {
				setFilteredTokens(mockTokens);
			} else {
				const filtered = mockTokens.filter(
					(token) =>
						token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
						token.name.toLowerCase().includes(searchTerm.toLowerCase())
				);
				setFilteredTokens(filtered);
			}
		}, 300);

		return () => clearTimeout(debounceTimer);
	}, [searchTerm]);

	// Apple-style animation variants
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
			transition: {
				delay: i * 0.03,
				duration: 0.3,
				ease: [0.22, 1, 0.36, 1],
			},
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
					className="absolute top-full left-0 right-0 mt-2 z-20 shadow-xl"
					ref={dropdownRef}>
					{/* Outer gradient border */}
					<div className="relative p-[1px] rounded-[8px] bg-gradient-to-r from-[#DC2366] to-[#4F5CAA]">
						{/* Inner content */}
						<div className="bg-white p-4 rounded-[9px] backdrop-blur-sm bg-opacity-90">
							<motion.p
								className="text-gray-400 text-sm mb-3"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1, transition: { delay: 0.1 } }}>
								Select currency
							</motion.p>

							{/* Search input with gradient icon */}
							<motion.div
								className="relative mb-4"
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}>
								<div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
									<img src={Search}
										className="w-5 h-5"
										style={
											{
												/* 	background: "linear-gradient(to right, #DC2366, #4F5CAA)",
											WebkitBackgroundClip: "text",
											backgroundClip: "text",
											color: "transparent", */
											}
										}
									/>
								</div>
								<motion.div
									className="relative"
									whileHover={{ scale: 1.01 }}
									whileFocus={{ scale: 1.01 }}>
									<div className="relative p-[1px] rounded-[8px] bg-gradient-to-r from-[#DC2366] to-[#4F5CAA]">
										{/* Inner content */}
										<div className="bg-white  rounded-[8px] backdrop-blur-sm bg-opacity-90">
											<input
												type="text"
												value={searchTerm}
												onChange={(e) => onSearchChange(e.target.value)}
												placeholder="Search currency"
												className="w-full pl-10 pr-3 py-3 border border-gray-300 text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 rounded-lg"
											/>
										</div>
									</div>
								</motion.div>
							</motion.div>

							<motion.p
								className="text-gray-400 text-sm mb-3"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1, transition: { delay: 0.2 } }}>
								Your tokens
							</motion.p>

							<div className="max-h-60 overflow-y-auto">
								{filteredTokens.length > 0 ? (
									filteredTokens.map((token, i) => (
										<motion.div
											key={token.symbol}
											custom={i}
											variants={itemVariants}
											initial="hidden"
											animate="visible"
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}
											className="relative p-[1px] mb-2 rounded-lg bg-gradient-to-r from-[#DC2366] to-[#4F5CAA]">
											<button
												onClick={() => onSelect(token)}
												className="w-full p-3 bg-white hover:bg-gray-50/80 transition-colors rounded-lg text-left">
												<div className="flex justify-between items-center">
													<div className="text-left">
														<div className="font-bold text-lg bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
															{token.symbol}
														</div>
														<div className="text-gray-400 text-sm">
															{token.address}
														</div>
													</div>
													<div className="text-right">
														<div className="font-bold text-lg bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
															{token.value.toFixed(2)} $
														</div>
														<div className="text-gray-400 text-sm">
															{token.balance.toFixed(4)}
														</div>
													</div>
												</div>
											</button>
										</motion.div>
									))
								) : (
									<motion.div
										variants={noResultsVariants}
										initial="hidden"
										animate="visible"
										className="flex flex-col items-center justify-center py-8">
										<X
											className="w-8 h-8 mb-2"
											style={{
												background:
													"linear-gradient(to right, #DC2366, #4F5CAA)",
												WebkitBackgroundClip: "text",
												backgroundClip: "text",
												color: "transparent",
											}}
										/>
										<div className="text-gray-400 text-sm">Nothing found</div>
									</motion.div>
								)}
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
