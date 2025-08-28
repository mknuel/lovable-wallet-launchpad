import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CommonButton from "../Buttons/CommonButton";
import { useTheme } from "../../context/ThemeContext"; // Import the theme context

export const ConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	isLoading,
}) => {
	const { isDarkMode } = useTheme(); // Use the theme context

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

	// Dynamic classes based on theme
	const modalContentClasses = `relative w-full max-w-sm p-6 rounded-2xl shadow-xl ${
		isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
	}`;

	const titleClasses = `text-xl font-bold text-center mb-2 ${
		isDarkMode ? "text-white" : "text-gray-900"
	}`;

	const descriptionClasses = `text-center mb-6 px-4 ${
		isDarkMode ? "text-gray-300" : "text-gray-600"
	}`;

	const dividerClasses = `border-t -mx-6 ${
		isDarkMode ? "border-gray-600" : "border-gray-200"
	}`;

	const spinnerClasses = `w-4 h-4 border-2 rounded-full animate-spin ${
		isDarkMode
			? "border-gray-600 border-t-pink-400"
			: "border-gray-300 border-t-pink-500"
	}`;

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
					<motion.div className={modalContentClasses} variants={modalVariants}>
						{/* Title */}
						<h3 className={titleClasses}>Swap Confirmation</h3>

						{/* Description */}
						<p className={descriptionClasses}>
							Confirm the amount and the Coin that you want to Swap
						</p>

						{/* Divider */}
						<div className={dividerClasses}></div>

						{/* Action Button */}
						<div className="mt-6">
							<CommonButton
								onClick={onConfirm}
								disabled={isLoading}
								className="w-full py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all">
								{isLoading ? (
									<div className="flex items-center justify-center gap-2">
										<div className={spinnerClasses}></div>
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
}) => {
	const { isDarkMode } = useTheme(); // Use the theme context

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

	// Dynamic classes based on theme
	const modalContentClasses = `relative w-full max-w-sm p-3 pt-4 rounded-2xl shadow-xl ${
		isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
	}`;

	const titleClasses = `text-xl font-bold text-center mb-2 ${
		isDarkMode ? "text-white" : "text-gray-900"
	}`;

	const descriptionClasses = `text-center mb-6 px-4 ${
		isDarkMode ? "text-gray-300" : "text-gray-600"
	}`;

	const dividerClasses = `border-t -mx-6 ${
		isDarkMode ? "border-gray-600" : "border-gray-200"
	}`;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-[100] flex items-center justify-center p-4"
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
					<motion.div className={modalContentClasses} variants={modalVariants}>
						{/* Title */}
						<h3 className={titleClasses}>{title}</h3>

						{/* Description */}
						<p className={descriptionClasses}>
							Your transaction has been sent and would be completed soon
						</p>

						{/* Divider */}
						<div className={dividerClasses}></div>

						{/* Action Button */}
						<button
							onClick={onConfirm}
							className="w-full py-3 pb-0 font-semibold rounded-lg focus:outline-none transition-all outline-none">
							<span className="bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent text-lg">
								GOT IT!
							</span>
						</button>
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
}) => {
	const { isDarkMode } = useTheme(); // Use the theme context

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

	// Dynamic classes based on theme
	const modalContentClasses = `relative w-full max-w-sm p-3 pt-4 rounded-2xl shadow-xl ${
		isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
	}`;

	const titleClasses = `text-xl font-bold text-center mb-2 ${
		isDarkMode ? "text-white" : "text-gray-900"
	}`;

	const descriptionClasses = `text-center mb-3 px-2 ${
		isDarkMode ? "text-gray-300" : "text-gray-600"
	}`;

	const dividerClasses = `border-t -mx-6 ${
		isDarkMode ? "border-gray-600" : "border-gray-200"
	}`;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-[100] flex items-center justify-center p-4"
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
					<motion.div className={modalContentClasses} variants={modalVariants}>
						{/* Title */}
						<h3 className={titleClasses}>Send Confirmation</h3>

						{/* Description */}
						<p className={descriptionClasses}>
							Confirm the amount and the fees for the transaction{" "}
						</p>

						{/* Divider */}
						<div className={dividerClasses}></div>

						{/* Action Button */}
						<div className="mt-0">
							<button
								onClick={onConfirm}
								className="w-full py-3 pb-0 font-semibold rounded-lg focus:outline-none transition-all outline-none">
								<span className="bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent text-lg">
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
