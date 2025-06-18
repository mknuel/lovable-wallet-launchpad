import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Custom hook for outside click detection
const useClickOutside = (ref, handler) => {
	React.useEffect(() => {
		const listener = (event) => {
			if (!ref.current || ref.current.contains(event.target)) {
				return;
			}
			handler(event);
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, handler]);
};

const defaultCurrencies = [
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

export const CurrencyDropdown = ({ isOpen, onClose, onSelect }) => {
	const dropdownRef = useRef(null);
	useClickOutside(dropdownRef, onClose);

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
					<div className="relative p-[1px] rounded-[10px] bg-gradient-to-r from-[#DC2366] to-[#4F5CAA]">
						{/* Inner content */}
						<div className="bg-white p-4 rounded-[9px] backdrop-blur-sm bg-opacity-90">
							<motion.p
								className="text-gray-400 text-sm mb-3"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1, transition: { delay: 0.1 } }}>
								Select currency
							</motion.p>

							<div className="max-h-60 overflow-y-auto">
								{defaultCurrencies.map((currency, i) => (
									<motion.div
										key={currency.symbol}
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
													<div className="font-bold text-lg bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
														{currency.symbol}
													</div>
													<div className="text-gray-400 text-sm">
														{currency.address}
													</div>
												</div>
												<div className="text-right">
													<div className="font-bold text-lg bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
														{currency.value.toFixed(2)} $
													</div>
													<div className="text-gray-400 text-sm">
														{currency.balance.toFixed(4)}
													</div>
												</div>
											</div>
										</button>
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
