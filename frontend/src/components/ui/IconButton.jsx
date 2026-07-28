import React from 'react';

const IconButton = ({ icon: Icon, active, activeColorClass = 'text-zinc-100 bg-zinc-800/80 border-zinc-700', label, onClick, disabled, className = '', ...props }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`
        flex items-center justify-center p-2 rounded-md transition-all duration-150 border
        ${active 
          ? `border-zinc-700 ${activeColorClass}` 
          : 'border-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 hover:border-zinc-800'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed hover:border-transparent hover:bg-transparent' : ''}
        ${className}
      `}
      {...props}
    >
      <Icon size={16} strokeWidth={active ? 2 : 1.5} />
      {label && <span className="sr-only">{label}</span>}
    </button>
  );
};

export default IconButton;
