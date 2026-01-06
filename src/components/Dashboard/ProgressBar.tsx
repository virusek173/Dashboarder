'use client';

import { getProgressColor } from '@/lib/calculations';

interface ProgressBarProps {
  percent: number;
}

export function ProgressBar({ percent }: ProgressBarProps) {
  const colorClass = getProgressColor(percent);

  const getBackgroundColor = () => {
    if (percent >= 80) return 'bg-status-success';
    if (percent >= 50) return 'bg-status-warning';
    return 'bg-status-danger';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className={`h-full ${getBackgroundColor()} transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className={`text-sm font-medium min-w-[3rem] text-right ${colorClass}`}>
        {percent}%
      </span>
    </div>
  );
}
