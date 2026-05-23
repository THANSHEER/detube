import React, { useEffect, useState, useMemo } from 'react';
import { DeTubeStorage, DeTubeTheme, Settings, DEFAULTS, type ThemeMode } from '../lib/storage';
import {
  SETTING_REGISTRY,
  SECTION_TITLES,
  getSectionsForCategory,
  type SettingCategory,
  type SettingSection,
  type SettingDefinition,
} from '../lib/config';
import {
  Home,
  PlayCircle,
  User,
  MessageSquare,
  Heart,
  Monitor,
  Layout,
  Settings as SettingsIcon,
  Search,
  Mic,
  Bell,
  Layers,
  Zap,
  Library,
  Clock,
  ListVideo,
  Download,
  Compass,
  Palette,
  Users,
  AtSign,
  Share2,
  FileText,
  Play,
  SquarePlus,
  ShoppingBag,
  Music,
  Film,
  Radio,
  Gamepad2,
  Newspaper,
  Trophy,
  GraduationCap,
  Shirt,
  Podcast,
  Joystick,
  Youtube,
  TvMinimal,
  Video,
  SlidersHorizontal,
  PanelLeft,
  Scissors,
  Power,
  type LucideIcon,
} from 'lucide-react';

import { Header } from '../components/Header';
import { NavRail, type NavTab } from '../components/NavRail';
import { SettingCard } from '../components/SettingCard';
import { SectionDivider } from '../components/SectionDivider';
import { SettingsPanel } from '../components/SettingsPanel';

// ---------------------------------------------------------------------------
// Icon resolver
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  PlayCircle,
  User,
  MessageSquare,
  Heart,
  Monitor,
  Layout,
  Settings: SettingsIcon,
  Search,
  Mic,
  Bell,
  Layers,
  Zap,
  Library,
  Clock,
  ListVideo,
  Download,
  Compass,
  Palette,
  Users,
  AtSign,
  Share2,
  FileText,
  Play,
  PlusSquare: SquarePlus,
  ShoppingBag,
  Music,
  Film,
  Radio,
  Gamepad2,
  Newspaper,
  Trophy,
  GraduationCap,
  Shirt,
  Podcast,
  Joystick,
  Youtube,
  Tv2: TvMinimal,
  Video,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] || SettingsIcon;
}

// ---------------------------------------------------------------------------
// Tab definitions — 6 pages
// ---------------------------------------------------------------------------

const TABS: NavTab[] = [
  { id: 'header',      label: 'Header',  Icon: SlidersHorizontal },
  { id: 'sidebar',     label: 'Sidebar', Icon: PanelLeft         },
  { id: 'homepage',    label: 'Home',    Icon: Home               },
  { id: 'videopage',   label: 'Video',   Icon: PlayCircle         },
  { id: 'channelpage', label: 'Channel', Icon: User               },
  { id: 'shortspage',  label: 'Shorts',  Icon: Scissors           },
];

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [activeTab, setActiveTab] = useState<SettingCategory | 'settings'>('header');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [browser, setBrowser] = useState<string>('chrome');

  // ── Apply theme to <html> whenever it changes ──────────────
  useEffect(() => {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // ── Init ───────────────────────────────────────────────────
  useEffect(() => {
    DeTubeStorage.getSettings().then(setSettings);
    DeTubeTheme.get().then(setTheme);

    // Detect the build-time browser from data-browser attribute
    const detectedBrowser = document.documentElement.getAttribute('data-browser') || 'chrome';
    setBrowser(detectedBrowser);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (!currentTab?.id) return;

      const url = currentTab.url || '';
      if (url.includes('youtube.com')) {
        // Auto-switch popup tab based on current YouTube page
        if (url.includes('/shorts/')) {
          setActiveTab('shortspage');
        } else if (url.includes('/watch?v=')) {
          setActiveTab('videopage');
        } else if (
          url.includes('/@') ||
          url.includes('/channel/') ||
          url.includes('/c/') ||
          url.includes('/user/')
        ) {
          setActiveTab('channelpage');
        } else {
          try {
            const path = new URL(url).pathname;
            if (path === '/' || path === '') setActiveTab('homepage');
          } catch { /* ignore */ }
        }

        chrome.tabs.sendMessage(currentTab.id, { action: 'checkLogin' }, (response) => {
          if (chrome.runtime.lastError) return;
          if (response && typeof response.isLoggedIn === 'boolean') {
            setIsLoggedIn(response.isLoggedIn);
          }
        });
      }
    });
  }, []);

  // ── Handlers ───────────────────────────────────────────────
  const handleSetEnabled = async (val: boolean) => {
    const updated = { ...settings, enabled: val } as Settings;
    setSettings(updated);
    await DeTubeStorage.saveSettings({ enabled: val } as Partial<Settings>);
  };

  const handleThemeChange = async (newTheme: ThemeMode) => {
    setTheme(newTheme);
    await DeTubeTheme.save(newTheme);
  };

  const handleToggle = async (key: string) => {
    const currentValue = (settings as Record<string, boolean>)[key];
    const newValue = !currentValue;
    const updated = { ...settings, [key]: newValue } as Settings;
    setSettings(updated);
    await DeTubeStorage.saveSettings({ [key]: newValue } as Partial<Settings>);
  };

  // ── Memoized settings for current tab ──────────────────────
  const currentSettings = useMemo(() => {
    if (activeTab === 'settings') return [];
    return SETTING_REGISTRY.filter((s) => s.category === activeTab);
  }, [activeTab]);

  const currentSections = useMemo(() => {
    if (activeTab === 'settings') return [];
    return getSectionsForCategory(activeTab as SettingCategory);
  }, [activeTab]);

  // ── Render helpers ─────────────────────────────────────────
  const isParentEnabled = (def: SettingDefinition): boolean => {
    if (!def.parentKey) return false;
    return !!(settings as Record<string, boolean>)[def.parentKey];
  };

  const isVisibleForLogin = (def: SettingDefinition): boolean => {
    if (!def.requiresLogin) return true;
    return isLoggedIn;
  };

  const renderSection = (section: SettingSection) => {
    const sectionSettings = currentSettings.filter((s) => s.section === section);
    if (sectionSettings.length === 0) return null;

    const topLevel = sectionSettings.filter((s) => !s.parentKey);
    const children = sectionSettings.filter((s) => !!s.parentKey);
    const visibleChildren = children.filter(isVisibleForLogin);

    return (
      <div key={section} className="mb-3 last:mb-0">
        <SectionDivider title={SECTION_TITLES[section]} />

        {/* Grouped section container */}
        <div className="bg-[var(--dt-surface-raised)] border border-[var(--dt-border)] rounded-[var(--dt-radius)] overflow-hidden divide-y divide-[var(--dt-border)]">
          {topLevel.map((def) => (
            <SettingCard
              key={def.key}
              label={def.label}
              Icon={resolveIcon(def.icon)}
              checked={!!(settings as Record<string, boolean>)[def.key]}
              onToggle={() => handleToggle(def.key)}
            />
          ))}

          {/* Children options inside the same unified card container */}
          {visibleChildren.length > 0 && !isParentEnabled(visibleChildren[0]) && (
            <div className="divide-y divide-[var(--dt-border)] bg-[var(--dt-surface-overlay)] animate-fade-in">
              {visibleChildren.map((def) => (
                <SettingCard
                  key={def.key}
                  label={def.label}
                  Icon={resolveIcon(def.icon)}
                  checked={!!(settings as Record<string, boolean>)[def.key]}
                  onToggle={() => handleToggle(def.key)}
                  isChild
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="dt-popup">

      {/* Fixed slim header strip */}
      <div className="dt-header-area">
        <Header
          enabled={settings.enabled}
          onToggle={() => handleToggle('enabled')}
        />
      </div>

      {/* Middle: nav rail (left) + content (right) */}
      <div className="dt-main-area">
        {!settings.enabled ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in select-none gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--dt-surface-raised)] border border-[var(--dt-border)] flex items-center justify-center text-[var(--dt-text-muted)]">
              <Power size={22} strokeWidth={1.7} className="animate-pulse-soft" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[13px] font-semibold text-[var(--dt-text-primary)] tracking-tight">
                Extension is Disabled
              </h2>
              <p className="text-[11px] font-medium text-[var(--dt-text-muted)] max-w-[160px] leading-relaxed">
                Press the power button to enable
              </p>
            </div>
          </div>
        ) : (
          <>
            <NavRail
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Content area: settings panel or settings list */}
            {activeTab === 'settings' ? (
              <SettingsPanel
                theme={theme}
                onThemeChange={handleThemeChange}
                browser={browser}
                onSetEnabled={handleSetEnabled}
              />
            ) : (
              <main key={activeTab} className="dt-body animate-slide-up space-y-3">
                {currentSections.map(renderSection)}
              </main>
            )}
          </>
        )}
      </div>

      {/* Fixed footer */}
    </div>
  );
};

export default App;
