import React from 'react';
import { LucideIcon } from 'lucide-react';
import { SettingCategory } from '../lib/config';

interface Tab {
  id: SettingCategory;
  label: string;
  Icon: LucideIcon;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: SettingCategory;
  onTabChange: (id: SettingCategory) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="flex gap-0.5 my-3 p-1 rounded-[var(--dt-radius)] bg-[var(--dt-surface-raised)] border border-[var(--dt-border)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 flex flex-col items-center gap-1 py-1.5 px-1 rounded-[var(--dt-radius-sm)]
              text-[8.5px] font-semibold uppercase tracking-wider
              transition-all duration-150 relative
              ${isActive
                ? 'bg-[var(--dt-accent)] text-white shadow-sm'
                : 'text-[var(--dt-text-secondary)] hover:text-[var(--dt-text-primary)] hover:bg-[var(--dt-surface-overlay)]'
              }
            `}
          >
            <tab.Icon
              size={15}
              strokeWidth={isActive ? 2.5 : 2}
              className="shrink-0"
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
