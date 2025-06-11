
import React from 'react';

export const MenuSection = ({ menuItems, className }) => {
  return (
		<div className={`flex flex-col gap-3 w-full max-w-full ${className || ""}`}>
			{menuItems.map((item) => (
				<button
					key={item.id}
					onClick={item.onClick}
					className="w-full max-w-full py-4 px-6 border border-pink-300 rounded-xl text-pink-600 font-semibold bg-white hover:bg-gray-50 transition-colors text-left"
					role="menuitem">
					{item.label}
				</button>
			))}
		</div>
	);
};
