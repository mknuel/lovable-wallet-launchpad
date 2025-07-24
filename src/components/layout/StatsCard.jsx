
import React from 'react';

export const StatsCard = ({ stats, className }) => {
  // Add safety check for stats array
  if (!stats || !Array.isArray(stats)) {
    return null;
  }

  return (
		<section
			className={`relative w-full max-w-full mx-auto text-white stats-box ${
				className || ""
			}`}
			role="region"
			aria-label="Financial statistics">
			{/* Main card with background image only */}
			<div className="absolute inset-0 rounded-3xl overflow-hidden ">
				<svg width="0" height="0" style={{ position: "absolute" }}>
					<defs>
						<clipPath id="customClip" clipPathUnits="objectBoundingBox">
							<path
								transform="scale(0.0031, 0.00503)"
								d="M302.533 0.09781L218.617 2.30686H95.2112C74.9961 1.57051 31.0401 0.09781 16.9365 0.09781C2.83297 0.09781 -0.2228 11.8794 0.0122593 17.7702V173.876C0.0122593 195.083 11.2951 199.403 16.9365 198.912C58.542 196.703 145.843 192.138 162.203 191.549C182.653 190.813 266.569 197.44 295.481 198.912C318.611 200.091 323.924 189.094 323.689 183.449C323.924 136.814 324.253 38.9771 323.689 20.7156C323.124 2.45413 309.35 -0.63854 302.533 0.09781Z"
							/>
						</clipPath>
					</defs>
				</svg>
			</div>

			{/* Content */}
			<div className="relative flex justify-center items-center h-full px-6 py-6">
				<div className="flex justify-between items-center w-full max-w-sm">
					{stats.map((stat, index) => (
						<React.Fragment key={stat.id}>
							<div className="text-center">
								<div style={{ fontSize: "40px", fontWeight: "400" }}>
									{stat.value}
								</div>
								<div
									style={{ fontSize: "15px" }}
									className="opacity-90 uppercase">
									{stat.label}
								</div>
							</div>
							{/* Demarcating line - only show between stats, not after the last one */}
							{index < stats.length - 1 && (
								<div
									className="w-0.5 h-16 bg-white opacity-70"
									style={{ width: "2px" }}
								/>
							)}
						</React.Fragment>
					))}
				</div>
			</div>
		</section>
	);
};
