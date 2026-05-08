import React, { useEffect, useState, useMemo } from 'react';
import { DeTubeStorage, Settings, DEFAULTS } from '../lib/storage';
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
  Menu,
  PlusSquare,
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
  Tv2,
  Video,
  type LucideIcon,
} from 'lucide-react';

// Components
import { Header } from '../components/Header';
import { TabNavigation } from '../components/TabNavigation';
import { SettingCard } from '../components/SettingCard';
import { SectionDivider } from '../components/SectionDivider';
import { Footer } from '../components/Footer';

// ---------------------------------------------------------------------------
// Icon resolver — maps icon name strings from config to Lucide components
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
  Menu,
  PlusSquare,
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
  Tv2,
  Video,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] || SettingsIcon;
}

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

const TABS: { id: SettingCategory; label: string; Icon: LucideIcon }[] = [
  { id: 'header', label: 'Header', Icon: SettingsIcon },
  { id: 'sidebar', label: 'Sidebar', Icon: Menu },
  { id: 'homepage', label: 'Home', Icon: Home },
  { id: 'videopage', label: 'Video', Icon: PlayCircle },
  { id: 'channelpage', label: 'Channel', Icon: User },
];

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [activeTab, setActiveTab] = useState<SettingCategory>('header');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // -----------------------------------------------------------------------
  // Init: load settings + detect login state & active page
  // -----------------------------------------------------------------------

  useEffect(() => {
    DeTubeStorage.getSettings().then(setSettings);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (!currentTab?.id) return;

      const url = currentTab.url || '';

      // Auto-switch popup tab based on current YouTube page
      if (url.includes('youtube.com')) {
        if (url.includes('/watch?v=')) {
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
            if (path === '/' || path === '') {
              setActiveTab('homepage');
            }
          } catch {
            // Ignore URL parsing errors
          }
        }

        // Only send checkLogin to YouTube tabs (where content script exists)
        chrome.tabs.sendMessage(currentTab.id, { action: 'checkLogin' }, (response) => {
          // Silently ignore connection errors — expected on non-injected tabs
          if (chrome.runtime.lastError) return;

          if (response && typeof response.isLoggedIn === 'boolean') {
            setIsLoggedIn(response.isLoggedIn);
          }
        });
      }
    });
  }, []);

  // -----------------------------------------------------------------------
  // Toggle handler
  // -----------------------------------------------------------------------

  const handleToggle = async (key: string) => {
    const currentValue = (settings as Record<string, boolean>)[key];
    const newValue = !currentValue;
    const updated = { ...settings, [key]: newValue } as Settings;
    setSettings(updated);
    await DeTubeStorage.saveSettings({ [key]: newValue } as Partial<Settings>);
  };

  // -----------------------------------------------------------------------
  // Memoized: settings for current tab
  // -----------------------------------------------------------------------

  const currentSettings = useMemo(() => {
    return SETTING_REGISTRY.filter((s) => s.category === activeTab);
  }, [activeTab]);

  const currentSections = useMemo(() => {
    return getSectionsForCategory(activeTab);
  }, [activeTab]);

  // -----------------------------------------------------------------------
  // Render helpers
  // -----------------------------------------------------------------------

  /**
   * Check if a setting's parent is currently enabled (meaning section is hidden,
   * so children should not be shown in the popup).
   */
  const isParentEnabled = (def: SettingDefinition): boolean => {
    if (!def.parentKey) return false;
    return !!(settings as Record<string, boolean>)[def.parentKey];
  };

  /**
   * Check if a setting should be visible based on login state.
   */
  const isVisibleForLogin = (def: SettingDefinition): boolean => {
    if (!def.requiresLogin) return true;
    return isLoggedIn;
  };

  /**
   * Render a section with its settings.
   */
  const renderSection = (section: SettingSection) => {
    const sectionSettings = currentSettings.filter((s) => s.section === section);
    if (sectionSettings.length === 0) return null;

    // Separate top-level (no parent) from children
    const topLevel = sectionSettings.filter((s) => !s.parentKey);
    const children = sectionSettings.filter((s) => !!s.parentKey);

    return (
      <React.Fragment key={section}>
        <SectionDivider title={SECTION_TITLES[section]} />

        {topLevel.map((def) => (
          <SettingCard
            key={def.key}
            label={def.label}
            description={def.description}
            Icon={resolveIcon(def.icon)}
            checked={!!(settings as Record<string, boolean>)[def.key]}
            onToggle={() => handleToggle(def.key)}
          />
        ))}

        {children.length > 0 && !isParentEnabled(children[0]) && (
          <div className="pl-3 space-y-1 border-l-2 border-[var(--dt-accent-border)] ml-1 animate-slide-up">
            {children
              .filter(isVisibleForLogin)
              .map((def) => (
                <SettingCard
                  key={def.key}
                  label={def.label}
                  description={def.description}
                  Icon={resolveIcon(def.icon)}
                  checked={!!(settings as Record<string, boolean>)[def.key]}
                  onToggle={() => handleToggle(def.key)}
                />
              ))}
          </div>
        )}
      </React.Fragment>
    );
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="dt-popup">
      {/* Fixed: header + tabs */}
      <div className="dt-header-area">
        <Header enabled={settings.enabled} onToggle={() => handleToggle('enabled')} />
        <TabNavigation tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Scrollable: settings list */}
      <main key={activeTab} className="dt-body animate-slide-up space-y-1">
        {currentSections.map(renderSection)}
      </main>

      {/* Fixed: footer */}
      <Footer />
    </div>
  );
};

export default App;
