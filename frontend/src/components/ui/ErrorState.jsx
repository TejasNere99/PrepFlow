import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Card from './Card.jsx';
import Button from './Button.jsx';

/**
 * Reusable ErrorState component
 */
export default function ErrorState({ error, onRetry }) {
  if (!error) return null;

  return (
    <Card className="border-red-900/50 bg-red-950/20 text-red-200">
      <div className="flex items-center gap-3">
        <AlertTriangle className="text-red-400 shrink-0" />
        <div className="flex-1 text-sm">{error}</div>
        {onRetry && (
          <Button size="sm" variant="secondary" onClick={onRetry} className="hover:bg-red-900/40 hover:text-red-100">
            Retry
          </Button>
        )}
      </div>
    </Card>
  );
}
