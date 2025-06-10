
import React from 'react';

export const StatsCard = ({ stats, className }) => {
  return (
    <section 
      className={`relative w-full mx-4 text-white ${className || ''}`}
      style={{ height: '299px' }}
      role="region"
      aria-label="Financial statistics"
    >
      {/* Main card with gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl"
      >
        {/* Background image overlay */}
        <img
          src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/7ddda6956027b1aaf014b9308d85a336a7bdc0a6?placeholderIfAbsent=true"
          alt=""
          className="absolute h-full w-full object-cover rounded-2xl opacity-30"
          role="presentation"
        />
      </div>
      
      {/* Content */}
      <div className="relative flex justify-center items-center h-full px-6">
        <div className="flex justify-between items-center w-full max-w-md">
          {stats.map((stat, index) => (
            <React.Fragment key={stat.id}>
              <div className="text-center">
                <div style={{ fontSize: '40px', fontWeight: '400' }}>{stat.value}</div>
                <div style={{ fontSize: '15px' }} className="opacity-90 uppercase">{stat.label}</div>
              </div>
              {/* Demarcating line - only show between stats, not after the last one */}
              {index < stats.length - 1 && (
                <div className="w-0.5 h-16 bg-white opacity-70" style={{ width: '2px' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
