
import React from 'react';

export const SecurityMessage = ({
  message = "All deposits are stored 100% without custody with keys held on this device",
  iconUrl = "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/5bcb0a3565a51fc1b336c5c58a4ef009955ff833?placeholderIfAbsent=true"
}) => {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 font-['Sansation'] justify-center px-4">
      <img
        src={iconUrl}
        alt="Security shield icon"
        className="w-6 h-6 object-contain"
      />
      <p className="max-w-xs text-center leading-relaxed">
        {message}
      </p>
    </div>
  );
};
