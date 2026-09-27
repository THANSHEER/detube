import React from 'react';
import { LucideIcon, Settings } from 'lucide-react';
import { SettingCategory } from '../lib/config';

export type NavTab = {
  id: SettingCategory | 'focus';
  label: string;
  Icon: LucideIcon;
};

interface NavRailProps {
  tabs: NavTab[];
  activeTab: SettingCategory | 'focus' | 'settings';
  onTabChange: (id: SettingCategory | 'focus' | 'settings') => void;
  activeCounts?: Record<string, number>;
}

export const NavRail: React.FC<NavRailProps> = ({
  tabs,
  activeTab,
  onTabChange,
  activeCounts = {},
}) => {
  const allTabIds: Array<SettingCategory | 'focus' | 'settings'> = [...tabs.map((t) => t.id), 'settings'];

  const handleKeyDown = (e: React.KeyboardEvent, currentId: SettingCategory | 'focus' | 'settings') => {
    const currentIndex = allTabIds.indexOf(currentId);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % allTabIds.length;
      onTabChange(allTabIds[nextIndex]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + allTabIds.length) % allTabIds.length;
      onTabChange(allTabIds[prevIndex]);
    }
  };

  return (
    <nav className="dt-nav-rail" aria-label="Page navigation" role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = activeCounts[tab.id] || 0;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            title={`${tab.label}${count > 0 ? ` (${count} active)` : ''}`}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            className={`dt-nav-rail-btn${isActive ? ' active' : ''}`}
          >
            <div className="relative flex items-center justify-center">
              <tab.Icon size={16} strokeWidth={isActive ? 2.4 : 1.7} className="transition-transform duration-200" />
              {count > 0 && (
                <span
                  className="dt-nav-badge"
                  title={`${count} hidden`}
                  aria-label={`${count} hidden`}
                >
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </div>
            <span className="dt-nav-rail-label">{tab.label}</span>
          </button>
        );
      })}

      <div className="dt-nav-rail-spacer" />

      <button
        role="tab"
        aria-selected={activeTab === 'settings'}
        tabIndex={activeTab === 'settings' ? 0 : -1}
        title="Settings"
        onClick={() => onTabChange('settings')}
        onKeyDown={(e) => handleKeyDown(e, 'settings')}
        className={`dt-nav-rail-btn settings-btn${activeTab === 'settings' ? ' active' : ''}`}
      >
        <Settings size={16} strokeWidth={activeTab === 'settings' ? 2.4 : 1.7} className="transition-transform duration-200" />
        <span className="dt-nav-rail-label">Settings</span>
      </button>
    </nav>
  );
};
