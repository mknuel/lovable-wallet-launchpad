
import React from 'react';

export const StatsCard = ({ title, value, icon, className }) => {
  return (
		<div
			className={`relative w-full max-w-full mx-auto text-white bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-4 ${
				className || ""
			}`}
			role="region"
			aria-label={`${title} statistics`}>
			
			{/* Content */}
			<div className="relative flex flex-col items-center text-center">
				<div className="text-2xl mb-1">{icon}</div>
				<div className="text-2xl font-bold mb-1">
					{value}
				</div>
				<div className="text-sm opacity-90 uppercase">
					{title}
				</div>
			</div>
		</div>
	);
};
