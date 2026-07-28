import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      {Icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 mb-3">
          <Icon className="text-zinc-500" size={18} strokeWidth={1.5} />
        </div>
      )}
      <h4 className="text-sm font-medium text-zinc-200">{title}</h4>
      {description && <p className="mt-1 text-xs text-zinc-500 max-w-[200px]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
