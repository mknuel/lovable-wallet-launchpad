
import React from 'react';

export const MenuSection = ({ menuItems, className }) => {
  return (
		<div className={`flex flex-col gap-3 w-full max-w-full ${className || ""}`}>
			{menuItems.map((item) => (
				<button
					key={item.id}
					onClick={item.onClick}
					className="w-full max-w-full py-4 px-6 border border-transparent bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-border rounded-xl text-transparent bg-clip-text font-semibold bg-white hover:bg-gray-50 transition-colors text-left relative overflow-hidden"
					style={{
						background:
							"linear-gradient(white, white) padding-box, linear-gradient(to right, #DC2366, #4F5CAA) border-box",
						backgroundClip: "padding-box, border-box",
					}}
					role="menuitem">
					<span className="bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent font-semibold">
						{item.label}
					</span>
				</button>
			))}
		</div>
	);
};
