import React from 'react';
import Button from './Button.jsx';

/**
 * Reusable EmptyState component
 */
export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  actionDisabled = false,
  actionIcon: ActionIcon
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/20 py-16 text-center transition-all">
      {Icon && (
        <div className="rounded-full bg-zinc-900 p-4 border border-zinc-800 text-zinc-500 mb-4">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-base font-semibold text-zinc-200">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      
      {actionLabel && onAction && (
        <Button 
          onClick={onAction} 
          className="mt-4 gap-2" 
          size="sm"
          disabled={actionDisabled}
        >
          {ActionIcon && <ActionIcon size={14} />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
