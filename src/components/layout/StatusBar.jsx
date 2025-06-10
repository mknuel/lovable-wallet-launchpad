
import React from 'react';

export const StatusBar = ({ className }) => {
  return (
    <header className={`flex w-full items-stretch gap-[40px_100px] ${className || ''}`} role="banner">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/90b6afa7875e8cd4ae47fed240bdab1758733c07?placeholderIfAbsent=true"
        alt="Network signal indicator"
        className="aspect-[2.57] object-contain w-[54px] shrink-0 rounded-[20px]"
      />
      <div className="flex items-center gap-1 flex-1 my-auto" role="group" aria-label="Status indicators">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/aa6cecba96d235bb18cc2647def118e7f7843606?placeholderIfAbsent=true"
          alt="Signal strength"
          className="aspect-[1.43] object-contain w-5 self-stretch shrink-0 my-auto"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/da59fcefe102b025cf97576a645501b70041d7b7?placeholderIfAbsent=true"
          alt="WiFi connection"
          className="aspect-[1.14] object-contain w-4 self-stretch shrink-0 my-auto"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/c9b730ba65b8301191f89dabf3dfe246b4cc0d49?placeholderIfAbsent=true"
          alt="Battery level"
          className="aspect-[2.08] object-contain w-[25px] self-stretch shrink-0 my-auto"
        />
      </div>
    </header>
  );
};
