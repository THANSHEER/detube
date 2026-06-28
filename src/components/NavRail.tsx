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
}

export const NavRail: React.FC<NavRailProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="dt-nav-rail" aria-label="Page navigation">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            title={tab.label}
            onClick={() => onTabChange(tab.id)}
            className={`dt-nav-rail-btn${isActive ? ' active' : ''}`}
          >
            <tab.Icon size={16} strokeWidth={isActive ? 2.4 : 1.7} />
            <span className="dt-nav-rail-label">{tab.label}</span>
          </button>
        );
      })}

      <div className="dt-nav-rail-spacer" />

      <button
        role="tab"
        aria-selected={activeTab === 'settings'}
        title="Settings"
        onClick={() => onTabChange('settings')}
        className={`dt-nav-rail-btn settings-btn${activeTab === 'settings' ? ' active' : ''}`}
      >
        <Settings size={16} strokeWidth={activeTab === 'settings' ? 2.4 : 1.7} />
        <span className="dt-nav-rail-label">Settings</span>
      </button>
    </nav>
  );
};
