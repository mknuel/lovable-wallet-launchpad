
import React from 'react';

const defaultNavItems = [
  { id: 'messages', icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/ce980df59d2e45dfb2487bd1a267aa68c36d3c53?placeholderIfAbsent=true', label: 'Messages' },
  { id: 'dial1', icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/03214bd6d68edcb29752f62522e6e5d597d50a77?placeholderIfAbsent=true', label: 'Dial' },
  { id: 'dial2', icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/44f4a511f05e8c6b1ae70f88f11a8032039468d4?placeholderIfAbsent=true', label: 'Dial' },
  { id: 'dial3', icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/9ef795a7e666f34dfeea6d31613d944f0b087e8c?placeholderIfAbsent=true', label: 'Dial' },
  { id: 'dial4', icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/34f0183867c6f73a05b1fb8d01546f290af7320b?placeholderIfAbsent=true', label: 'Dial' },
  { id: 'contact', icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/1feb2a6cba270cf15db25be6dab70b3c838d28fe?placeholderIfAbsent=true', label: 'Contact' },
];

export const SwapBottomNavigation = ({ items = defaultNavItems }) => {
  return (
		<nav
			className="bg-white shadow-[0px_-4px_12px_rgba(0,0,0,0.05)] flex min-h- w-full flex-col items-center justify-center px-5 pt-[23px] pb-3 mt-0"
			aria-label="Bottom navigation">
			<ul className="flex max-w-full w-80 items-center justify-between">
				{items.map((item) => (
					<li
						key={item.id}
						className="self-stretch flex flex-col items-center w-[65px] my-auto">
						<button
							onClick={item.onClick}
							className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
							aria-label={item.label}>
							<img
								src={item.icon}
								alt=""
								className={`aspect-[1] object-contain ${
									item.id === "dial3" ? "w-4" : "w-5"
								}`}
							/>
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
};
