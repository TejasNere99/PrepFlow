import React from 'react';
import Card from '../ui/Card.jsx';
import ProgressBar from '../ui/ProgressBar.jsx';

function ProgressCard({ title, completed, total, percentage, className = '' }) {
  return (
    <Card className={`space-y-4 ${className}`}>
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
        <span className="text-sm font-medium text-zinc-400">
          {completed} / {total} Resources
        </span>
      </div>
      <ProgressBar value={percentage} label="Completion" />
    </Card>
  );
}

export default ProgressCard;
