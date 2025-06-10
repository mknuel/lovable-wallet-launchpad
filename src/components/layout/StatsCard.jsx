
import React from 'react';

export const StatsCard = ({ stats, className }) => {
  return (
    <section 
      className={`bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white w-full mx-4 ${className || ''}`}
      role="region"
      aria-label="Financial statistics"
    >
      <div className="flex justify-between items-center">
        {stats.map((stat) => (
          <div key={stat.id} className="text-center">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm opacity-90 uppercase">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
