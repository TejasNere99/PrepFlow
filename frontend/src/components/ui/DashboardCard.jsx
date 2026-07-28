import React from 'react';

const DashboardCard = ({ children, className = '', noPadding = false, ...props }) => {
  return (
    <div 
      className={`bg-zinc-950/60 border border-zinc-800/60 rounded-xl transition-all duration-150 hover:border-zinc-700 hover:bg-zinc-900/50 ${noPadding ? '' : 'p-4 sm:p-5'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default DashboardCard;
