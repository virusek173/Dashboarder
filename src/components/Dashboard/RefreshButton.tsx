'use client';

import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onClick: () => void;
  loading: boolean;
}

export function RefreshButton({ onClick, loading }: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-primary-blue hover:bg-secondary-blue text-text-primary rounded-md transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RefreshCw
        size={16}
        className={loading ? 'animate-spin' : ''}
      />
      <span className="text-sm font-medium">Refresh</span>
    </button>
  );
}
