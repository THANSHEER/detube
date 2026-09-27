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
  Target,
  Flag,
  AlignVerticalSpaceAround,
  X,
  type LucideIcon,
} from 'lucide-react';

import { Header } from '../components/Header';
import { NavRail, type NavTab } from '../components/NavRail';
import { SettingCard } from '../components/SettingCard';
import { SectionDivider } from '../components/SectionDivider';
import { SettingsPanel } from '../components/SettingsPanel';
import { FocusPanel } from '../components/FocusPanel';

// ---------------------------------------------------------------------------
// Category display labels
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<string, string> = {
  header: 'Header',
  sidebar: 'Sidebar',
  homepage: 'Home',
  videopage: 'Video',
  channelpage: 'Channel',
  shortspage: 'Shorts',
};

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
  Flag,
  AlignVerticalSpaceAround,
  Scissors,
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
  { id: 'focus',       label: 'Focus',   Icon: Target             },
];

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [activeTab, setActiveTab] = useState<SettingCategory | 'focus' | 'settings'>('header');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [browser, setBrowser] = useState<string>('chrome');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

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

  // ── Global Keyboard Shortcuts ──────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!settings.enabled) return;
      // Toggle search with "/" or "Cmd/Ctrl+K" when not focused on an input
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
        document.activeElement?.tagName !== 'INPUT'
      ) {
        e.preventDefault();
        setIsSearching((prev) => !prev);
      } else if (e.key === 'Escape' && isSearching) {
        e.preventDefault();
        setIsSearching(false);
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearching, settings.enabled]);

  // ── Handlers ───────────────────────────────────────────────
  const handleSetEnabled = async (val: boolean) => {
    if (!val) {
      setIsSearching(false);
      setSearchQuery('');
    }
    const updated = { ...settings, enabled: val } as Settings;
    setSettings(updated);
    await DeTubeStorage.saveSettings({ enabled: val } as Partial<Settings>);
  };

  const handleThemeChange = async (newTheme: ThemeMode) => {
    setTheme(newTheme);
    await DeTubeTheme.save(newTheme);
  };

  const handleToggle = async (key: string) => {
    if (key === 'enabled' && settings.enabled) {
      setIsSearching(false);
      setSearchQuery('');
    }
    const currentValue = (settings as Record<string, boolean>)[key];
    const newValue = !currentValue;
    const updated = { ...settings, [key]: newValue } as Settings;
    setSettings(updated);
    await DeTubeStorage.saveSettings({ [key]: newValue } as Partial<Settings>);
  };

  // ── Active rule counts per tab category ────────────────────
  const activeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const setting of SETTING_REGISTRY) {
      if ((settings as Record<string, boolean>)[setting.key]) {
        counts[setting.category] = (counts[setting.category] || 0) + 1;
      }
    }
    return counts;
  }, [settings]);

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

  // ── Global Search Filter ───────────────────────────────────
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return SETTING_REGISTRY.filter((s) => {
      if (!isVisibleForLogin(s)) return false;
      const labelMatch = s.label.toLowerCase().includes(query);
      const categoryName = (CATEGORY_LABELS[s.category] || s.category).toLowerCase();
      const categoryMatch = categoryName.includes(query) || s.category.toLowerCase().includes(query);
      const sectionMatch = (SECTION_TITLES[s.section] || '').toLowerCase().includes(query);
      return labelMatch || categoryMatch || sectionMatch;
    });
  }, [searchQuery, isLoggedIn]);

  const renderSection = (section: SettingSection, idx: number) => {
    const sectionSettings = currentSettings.filter((s) => s.section === section);
    if (sectionSettings.length === 0) return null;

    const topLevel = sectionSettings.filter((s) => !s.parentKey);
    const children = sectionSettings.filter((s) => !!s.parentKey);
    const visibleChildren = children.filter(isVisibleForLogin);

    // Calculate active count for this section
    const activeCount = sectionSettings.filter((s) => !!(settings as Record<string, boolean>)[s.key]).length;
    const totalCount = sectionSettings.length;

    return (
      <div
        key={section}
        className="mb-3 last:mb-0 animate-tab-enter"
        style={{ animationDelay: `${idx * 25}ms` }}
      >
        <SectionDivider
          title={SECTION_TITLES[section]}
          activeCount={activeCount}
          totalCount={totalCount}
        />

        {/* Grouped section container */}
        <div className="bg-[var(--dt-surface-raised)] border border-[var(--dt-border)] rounded-[var(--dt-radius)] overflow-hidden divide-y divide-[var(--dt-border)] shadow-sm">
          {topLevel.map((def) => {
            const itemChildren = visibleChildren.filter(
              (c) => c.parentKey === def.key && !isParentEnabled(c)
            );
            return (
              <React.Fragment key={def.key}>
                <SettingCard
                  label={def.label}
                  Icon={resolveIcon(def.icon)}
                  checked={!!(settings as Record<string, boolean>)[def.key]}
                  onToggle={() => handleToggle(def.key)}
                />
                {itemChildren.length > 0 && (
                  <div className="divide-y divide-[var(--dt-border)] bg-[var(--dt-surface-overlay)] animate-fade-in">
                    {itemChildren.map((childDef) => (
                      <SettingCard
                        key={childDef.key}
                        label={childDef.label}
                        Icon={resolveIcon(childDef.icon)}
                        checked={!!(settings as Record<string, boolean>)[childDef.key]}
                        onToggle={() => handleToggle(childDef.key)}
                        isChild
                      />
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="dt-popup animate-popup-open">

      {/* Fixed slim header strip */}
      <div className="dt-header-area">
        <Header
          enabled={settings.enabled}
          onToggle={() => handleToggle('enabled')}
          isSearching={isSearching}
          onToggleSearch={() => {
            setIsSearching((prev) => {
              if (prev) setSearchQuery('');
              return !prev;
            });
          }}
        />
      </div>

      {/* Search Input Bar (when search is toggled open) */}
      {settings.enabled && isSearching && (
        <div className="dt-search-container">
          <div className="dt-search-input-wrap">
            <Search size={13} className="text-[var(--dt-text-muted)] shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search 70+ settings... (e.g. comments, shorts)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setIsSearching(false);
                  setSearchQuery('');
                }
              }}
              className="dt-search-input"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-0.5 rounded text-[var(--dt-text-muted)] hover:text-[var(--dt-text-primary)] cursor-pointer border-none bg-transparent"
                title="Clear search"
              >
                <X size={12} />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsSearching(false);
                setSearchQuery('');
              }}
              className="dt-search-kbd cursor-pointer hover:bg-[var(--dt-surface-raised)] transition-colors border-none"
              title="Close search (ESC)"
            >
              ESC
            </button>
          </div>
        </div>
      )}

      {/* Middle: nav rail (left) + content (right) */}
      <div className="dt-main-area">
        {!settings.enabled ? (
          <div 
            className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in select-none gap-3 cursor-pointer group active:scale-95 transition-transform duration-300 [transition-timing-function:var(--dt-spring)]"
            onClick={() => handleToggle('enabled')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleToggle('enabled'); }
            }}
          >
            <div className="w-12 h-12 rounded-full bg-[var(--dt-surface-raised)] border border-[var(--dt-border)] flex items-center justify-center text-[var(--dt-text-muted)] group-hover:text-[var(--dt-accent)] group-hover:border-[var(--dt-accent-border)] group-hover:bg-[var(--dt-accent-soft)] transition-all duration-300 [transition-timing-function:var(--dt-spring)] shadow-sm">
              <Power size={22} strokeWidth={1.7} className="animate-pulse-soft group-hover:animate-none" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[13px] font-semibold text-[var(--dt-text-primary)] tracking-tight transition-colors duration-300">
                Extension is Disabled
              </h2>
              <p className="text-[11px] font-medium text-[var(--dt-text-muted)] max-w-[160px] leading-relaxed group-hover:text-[var(--dt-text-secondary)] transition-colors duration-300">
                Press anywhere to enable
              </p>
            </div>
          </div>
        ) : isSearching && searchQuery.trim() ? (
          /* Search results view */
          <main className="dt-body animate-tab-enter space-y-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--dt-text-secondary)]">
                Search Results
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--dt-surface-overlay)] text-[var(--dt-text-muted)]">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-8 text-center bg-[var(--dt-surface-raised)] rounded-[var(--dt-radius)] border border-[var(--dt-border)] flex flex-col items-center gap-2">
                <Search size={20} className="text-[var(--dt-text-muted)] opacity-50" />
                <p className="text-[12px] font-medium text-[var(--dt-text-secondary)]">
                  No settings matching &ldquo;{searchQuery}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] text-[var(--dt-accent)] font-semibold border-none bg-transparent cursor-pointer hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="bg-[var(--dt-surface-raised)] border border-[var(--dt-border)] rounded-[var(--dt-radius)] overflow-hidden divide-y divide-[var(--dt-border)] shadow-sm">
                {searchResults.map((def) => (
                  <SettingCard
                    key={def.key}
                    label={def.label}
                    Icon={resolveIcon(def.icon)}
                    checked={!!(settings as Record<string, boolean>)[def.key]}
                    onToggle={() => handleToggle(def.key)}
                    categoryName={CATEGORY_LABELS[def.category] || def.category}
                  />
                ))}
              </div>
            )}
          </main>
        ) : (
          <>
            <NavRail
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={(tab) => {
                if (isSearching) setIsSearching(false);
                setActiveTab(tab);
              }}
              activeCounts={activeCounts}
            />

            {/* Content area: settings panel, focus panel, or settings list */}
            {activeTab === 'settings' ? (
              <SettingsPanel
                theme={theme}
                onThemeChange={handleThemeChange}
                browser={browser}
              />
            ) : activeTab === 'focus' ? (
              <div className="dt-focus-panel animate-tab-enter">
                <FocusPanel onSetEnabled={handleSetEnabled} />
              </div>
            ) : (
              <main key={activeTab} className="dt-body animate-tab-enter space-y-3">
                {currentSections.map((sec, idx) => renderSection(sec, idx))}
              </main>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default App;
