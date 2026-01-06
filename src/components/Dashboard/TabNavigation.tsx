'use client';

import { TabType } from '@/types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'displays', label: 'Displays' },
    { id: 'features', label: 'Features' },
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-2 rounded-lg font-medium transition-smooth ${
            activeTab === tab.id
              ? 'bg-primary-blue text-text-primary'
              : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
