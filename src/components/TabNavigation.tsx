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
    <nav
      role="tablist"
      className="flex gap-0.5 my-3 p-1 rounded-[var(--dt-radius)] bg-[var(--dt-surface-raised)] border border-[var(--dt-border)]"
      style={{ boxShadow: 'var(--dt-shadow-sm)' }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 flex flex-col items-center gap-[5px] py-[7px] px-1
              rounded-[calc(var(--dt-radius)-4px)]
              text-[8.5px] font-bold uppercase tracking-widest
              transition-all duration-200 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-[var(--dt-accent)] focus-visible:ring-inset
              ${isActive
                ? 'text-white'
                : 'text-[var(--dt-text-muted)] hover:text-[var(--dt-text-secondary)] hover:bg-[var(--dt-surface-overlay)]'
              }
            `}
            style={isActive ? {
              background: 'var(--dt-gradient)',
              boxShadow: 'var(--dt-shadow-accent)',
            } : undefined}
          >
            <tab.Icon
              size={14}
              strokeWidth={isActive ? 2.5 : 2}
              className="shrink-0"
            />
            <span className={`leading-none ${isActive ? 'opacity-100' : 'opacity-55'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
