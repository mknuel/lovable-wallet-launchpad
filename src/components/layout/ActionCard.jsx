import React from 'react';

export const ActionCard = ({ 
  title, 
  isHighlighted = false, 
  onClick = () => {},
  icon,
  disabled = false
}) => {
  const baseClasses = `flex h-[108px] items-center relative rounded-2xl transition-all duration-200 ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 cursor-pointer'}`;
  const highlightedClasses = "w-[157px] max-sm:w-[calc(50%_-_4px)]";
  const normalClasses = `flex w-[157px] border bg-white pl-4 pr-[82px] pt-14 pb-7 border-solid border-[#D9D4D4] max-sm:w-[calc(50%_-_4px)] max-sm:pt-14 max-sm:pb-7 max-sm:px-4 ${disabled ? '' : 'hover:border-gray-300'}`;

  if (isHighlighted) {
    return (
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`${baseClasses} ${highlightedClasses}`}
        style={{
          background: 'linear-gradient(135deg, #DC2366 0%, #4F5CAA 100%)'
        }}
        aria-label={`${title} action`}
      >
        <div className="text-white text-lg font-bold leading-6 absolute w-16 h-6 left-4 top-14">
          {title}
        </div>
        <div className="inline-flex flex-col justify-center items-center gap-2.5 absolute w-9 h-9 bg-white p-2 rounded-[27px] left-[105px] top-4">
          <div className="w-5 h-5 relative">
            <div className="w-5 h-5 shrink-0 absolute bg-[#D9D9D9] left-0 top-0" />
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    "<svg id=\"32159:3547\" layer-name=\"north_east\" width=\"13\" height=\"13\" viewBox=\"0 0 13 13\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"arrow-icon\" style=\"width: 12px; height: 12px; flex-shrink: 0; fill: #1C1B1F; position: absolute; left: 4px; top: 4px\"> <path d=\"M10.6667 2.99935L1.58333 12.0827C1.43056 12.2355 1.23611 12.3118 1 12.3118C0.763889 12.3118 0.569444 12.2355 0.416667 12.0827C0.263889 11.9299 0.1875 11.7355 0.1875 11.4993C0.1875 11.2632 0.263889 11.0688 0.416667 10.916L9.5 1.83268H4.83333C4.59722 1.83268 4.39931 1.75282 4.23958 1.5931C4.07986 1.43338 4 1.23546 4 0.999349C4 0.763238 4.07986 0.565321 4.23958 0.405599C4.39931 0.245877 4.59722 0.166016 4.83333 0.166016H11.5C11.7361 0.166016 11.934 0.245877 12.0938 0.405599C12.2535 0.565321 12.3333 0.763238 12.3333 0.999349V7.66602C12.3333 7.90213 12.2535 8.10004 12.0938 8.25977C11.934 8.41949 11.7361 8.49935 11.5 8.49935C11.2639 8.49935 11.066 8.41949 10.9062 8.25977C10.7465 8.10004 10.6667 7.90213 10.6667 7.66602V2.99935Z\" fill=\"#1C1B1F\"></path> </svg>",
                }}
              />
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${normalClasses}`}
      aria-label={`${title} action`}
    >
      <div className="text-[#595959] text-lg font-bold leading-6 absolute left-4 top-14">
        {title}
      </div>
      {icon && (
        <div className="absolute right-4 top-4">
          {icon}
        </div>
      )}
    </button>
  );
};