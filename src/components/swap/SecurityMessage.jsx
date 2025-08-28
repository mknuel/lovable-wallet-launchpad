
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const SecurityMessage = ({
  message = "All deposits are stored 100% without custody with keys held on this device",
  iconUrl = "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/5bcb0a3565a51fc1b336c5c58a4ef009955ff833?placeholderIfAbsent=true"
}) => {
  const { isDarkMode } = useTheme();
  
  return (
		<div className={`flex items-center gap-2 text-xs font-['Sansation'] px-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
			<img
				src={iconUrl}
				alt="Security shield icon"
				className={`w-6 h-6 object-contain ${isDarkMode ? 'filter brightness-0 invert' : ''}`}
			/>
			<p className="max-w-xs leading-relaxed">{message}</p>
		</div>
	);
};
