import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable LoadingSkeleton component
 */
export default function LoadingSkeleton({ rows = 5, className }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-4", className)}>
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="h-6 w-1/4 rounded bg-zinc-800/50 animate-pulse" />
        
        {/* Rows Skeleton */}
        <div className="space-y-3 pt-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 w-12 rounded bg-zinc-800/30 animate-pulse" />
              <div className="h-10 flex-1 rounded bg-zinc-800/30 animate-pulse" />
              <div className="h-10 w-24 rounded bg-zinc-800/30 animate-pulse" />
              <div className="h-10 w-20 rounded bg-zinc-800/30 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
