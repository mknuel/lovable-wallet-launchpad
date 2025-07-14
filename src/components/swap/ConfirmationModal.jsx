import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CommonButton from "../Buttons/CommonButton";
/* 
{
    "originAmount": "77774736346048003009000000",
    "destinationAmount": "1000000000000000000",
    "blockNumber": "73485103",
    "timestamp": 1751456804428,
    "estimatedExecutionTimeMs": 12500,
    "steps": [
        {
            "originToken": {
                "chainId": 137,
                "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                "symbol": "POL",
                "name": "POL",
                "decimals": 18,
                "priceUsd": 0.181714,
                "iconUri": "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912"
            },
            "destinationToken": {
                "chainId": 1,
                "address": "0x4507cEf57C46789eF8d1a19EA45f4216bae2B528",
                "symbol": "TOKEN",
                "name": "TokenFi",
                "decimals": 9,
                "priceUsd": 0.0126021988770277,
                "iconUri": "https://coin-images.coingecko.com/coins/images/32507/large/MAIN_TokenFi_logo_icon.png?1698918427"
            },
            "originAmount": "77774736346048003009000000",
            "destinationAmount": "1000000000000000000",
            "estimatedExecutionTimeMs": 12500
        }
    ],
    "intent": {
        "originChainId": 137,
        "originTokenAddress": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "destinationChainId": 1,
        "destinationTokenAddress": "0x4507cEf57C46789eF8d1a19EA45f4216bae2B528",
        "amount": "1000000000000000000",
        "maxSteps": 3
    }
} */

export const ConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	isLoading,
}) => {
	// Animation variants for the modal backdrop
	const backdropVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	// Animation variants for the modal panel
	const modalVariants = {
		hidden: { opacity: 0, scale: 0.95, y: 20 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: { type: "spring", damping: 15, stiffness: 200 },
		},
		exit: {
			opacity: 0,
			scale: 0.9,
			y: 20,
			transition: { duration: 0.2 },
		},
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center p-4"
					initial="hidden"
					animate="visible"
					exit="exit">
					{/* Modal Overlay */}
					<motion.div
						className="fixed inset-0 bg-black/20 bg-opacity-60"
						variants={backdropVariants}
						onClick={onClose} // Close modal when overlay is clicked
					></motion.div>

					{/* Modal Content */}
					<motion.div
						className="relative bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl"
						variants={modalVariants}>
						{/* Title */}
						<h3 className="text-xl font-bold text-center text-gray-900 mb-2">
							Swap Confirmation
						</h3>

						{/* Description */}
						<p className="text-center text-gray-600 mb-6 px-4">
							Confirm the amount and the Coin that you want to Swap
						</p>

						{/* Divider */}
						<div className="border-t border-gray-200 -mx-6"></div>

						{/* Action Button */}
						<div className="mt-6">
							<CommonButton
								onClick={onConfirm}
								disabled={isLoading}
								className="w-full py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all">
								{isLoading ? (
									<div className="flex items-center justify-center gap-2">
										<div className="w-4 h-4 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
										<span className="bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
											Processing...
										</span>
									</div>
								) : (
									<span className="bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
										Confirm
									</span>
								)}
							</CommonButton>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export const TransactionSuccessModal = ({
	isOpen,
	onClose,
	onConfirm,
	title = "Success",
	isLoading,
}) => {
	// Animation variants for the modal backdrop
	const backdropVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	// Animation variants for the modal panel
	const modalVariants = {
		hidden: { opacity: 0, scale: 0.95, y: 20 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: { type: "spring", damping: 15, stiffness: 200 },
		},
		exit: {
			opacity: 0,
			scale: 0.9,
			y: 20,
			transition: { duration: 0.2 },
		},
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center p-4"
					initial="hidden"
					animate="visible"
					exit="exit">
					{/* Modal Overlay */}
					<motion.div
						className="fixed inset-0 bg-black/20 bg-opacity-60"
						variants={backdropVariants}
						onClick={onClose} // Close modal when overlay is clicked
					></motion.div>

					{/* Modal Content */}
					<motion.div
						className="relative bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl"
						variants={modalVariants}>
						{/* Title */}
						<h3 className="text-xl font-bold text-center text-gray-900 mb-2">
							{title}
						</h3>

						{/* Description */}
						<p className="text-center text-gray-600 mb-6 px-4">
							Your transaction has been sent and would be completed soon
						</p>

						{/* Divider */}
						<div className="border-t border-gray-200 -mx-6"></div>

						{/* Action Button */}
						<div className="mt-6">
							<CommonButton
								onClick={onConfirm}
								disabled={isLoading}
								className="w-full py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all">
								<span className="bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
									Confirm
								</span>
							</CommonButton>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
export const SendConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	isLoading,
}) => {
	// Animation variants for the modal backdrop
	const backdropVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	// Animation variants for the modal panel
	const modalVariants = {
		hidden: { opacity: 0, scale: 0.95, y: 20 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: { type: "spring", damping: 15, stiffness: 200 },
		},
		exit: {
			opacity: 0,
			scale: 0.9,
			y: 20,
			transition: { duration: 0.2 },
		},
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center p-4"
					initial="hidden"
					animate="visible"
					exit="exit">
					{/* Modal Overlay */}
					<motion.div
						className="fixed inset-0 bg-black/20 bg-opacity-60"
						variants={backdropVariants}
						onClick={onClose} // Close modal when overlay is clicked
					></motion.div>

					{/* Modal Content */}
					<motion.div
						className="relative bg-white w-full max-w-sm p-3 rounded-2xl shadow-xl"
						variants={modalVariants}>
						{/* Title */}
						<h3 className="text-xl font-bold text-center text-gray-900 mb-2">
							Send Confirmation
						</h3>

						{/* Description */}
						<p className="text-center text-gray-600 mb-3 px-2">
							Confirm the amount and the fees for the transaction{" "}
						</p>

						{/* Divider */}
						<div className="border-t border-gray-200 -mx-6"></div>

						{/* Action Button */}
						<div className="mt-0">
							<button
								onClick={onConfirm}
								className="w-full py-3 pb-0 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all">
								<span className="bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
									Confirm
								</span>
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
