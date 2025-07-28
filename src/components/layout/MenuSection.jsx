
import React from 'react';

export const MenuSection = ({ menuItems, className, uppercase = false }) => {
  return (
		<div className={`flex flex-col gap-3 w-full max-w-full ${className || ""}`}>
			{menuItems.map((item) => (
				<button
					key={item.id}
					onClick={item.onClick}
					className="w-full max-w-full py-4 px-6 border border-transparent rounded-xl bg-white hover:bg-gray-50 transition-colors text-left relative overflow-hidden min-h-[60px] flex items-center"
					style={{
						background:
							"linear-gradient(white, white) padding-box, linear-gradient(to right, #DC2366, #4F5CAA) border-box",
						backgroundClip: "padding-box, border-box",
						border: "2px solid transparent",
					}}
					role="menuitem">
					<span 
						className={`bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent font-semibold text-[16px] leading-relaxed break-words whitespace-normal tracking-wide ${uppercase ? 'uppercase' : ''}`}
						style={{
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
							display: "block",
							width: "100%",
						}}>
						{item.label}
					</span>
				</button>
			))}
		</div>
	);
};
