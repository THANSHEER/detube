/**
 * DeTube — Single Source of Truth Configuration Registry
 *
 * Every setting is defined ONCE here. All other modules derive from this:
 * - Storage layer: Settings type + DEFAULTS
 * - Content script: setting→CSS class mapping
 * - Popup UI: labels, descriptions, icons, sections
 * - Validation scripts: automated checks
 *
 * TO ADD A NEW SETTING:
 *   1. Add one entry to SETTING_REGISTRY below
 *   2. Add the CSS rule in the appropriate src/content/css/selectors/*.css file
 *   3. Run `npm run build:css` to regenerate the combined CSS
 *   That's it. No other file changes needed.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SettingCategory = 'header' | 'sidebar' | 'homepage' | 'videopage' | 'channelpage';

export type SettingSection =
  // Header
  | 'header-controls'
  // Sidebar
  | 'sidebar-navigation'
  | 'sidebar-you'
  | 'sidebar-explore'
  | 'sidebar-more'
  // Homepage
  | 'homepage-feed'
  // Video page
  | 'video-layout'
  | 'video-interactions'
  | 'video-content'
  // Channel page
  | 'channel-branding'
  | 'channel-tabs';

export interface SettingDefinition {
  /** Storage key — must be unique, used as `keyof Settings` */
  key: string;
  /** CSS class toggled on `<html>` (e.g. 'dt-hide-search') */
  cssClass: string;
  /** Which popup tab this belongs to */
  category: SettingCategory;
  /** Sub-section within the tab (used for dividers) */
  section: SettingSection;
  /** Default value (always false for hide toggles) */
  defaultValue: boolean;
  /** Display label in popup */
  label: string;
  /** Short description in popup */
  description: string;
  /** Lucide icon name (matched in popup) */
  icon: string;
  /**
   * If set, this item is a child of the given parent key.
   * The child is only visible when the parent is NOT checked (i.e. section is shown).
   */
  parentKey?: string;
  /**
   * If true, this setting requires the user to be logged in to show in the popup.
   */
  requiresLogin?: boolean;
}

// ---------------------------------------------------------------------------
// Section display metadata (for SectionDivider titles)
// ---------------------------------------------------------------------------

export const SECTION_TITLES: Record<SettingSection, string> = {
  'header-controls': 'Header Controls',
  'sidebar-navigation': 'Navigation',
  'sidebar-you': 'You Section',
  'sidebar-explore': 'Explore',
  'sidebar-more': 'More about YouTube',
  'homepage-feed': 'Main Feed',
  'video-layout': 'Layout & Player',
  'video-interactions': 'Interactions',
  'video-content': 'Content',
  'channel-branding': 'Stats & Branding',
  'channel-tabs': 'Navigation Tabs',
};

// ---------------------------------------------------------------------------
// The Registry — Single Source of Truth
// ---------------------------------------------------------------------------

export const SETTING_REGISTRY: SettingDefinition[] = [
  // =========================================================================
  // HEADER
  // =========================================================================
  {
    key: 'hideSearch',
    cssClass: 'dt-hide-search',
    category: 'header',
    section: 'header-controls',
    defaultValue: false,
    label: 'Hide Search Bar',
    description: 'Removes the top search box',
    icon: 'Search',
  },
  {
    key: 'hideVoiceSearch',
    cssClass: 'dt-hide-voice-search',
    category: 'header',
    section: 'header-controls',
    defaultValue: false,
    label: 'Hide Voice Search',
    description: 'Removes the microphone icon',
    icon: 'Mic',
  },
  {
    key: 'hideNotifications',
    cssClass: 'dt-hide-notifications',
    category: 'header',
    section: 'header-controls',
    defaultValue: false,
    label: 'Hide Notifications',
    description: 'Removes the bell icon',
    icon: 'Bell',
  },
  {
    key: 'hideCreateButton',
    cssClass: 'dt-hide-create-button',
    category: 'header',
    section: 'header-controls',
    defaultValue: false,
    label: 'Hide Create Button',
    description: 'Removes the plus create icon',
    icon: 'PlusSquare',
  },
  {
    key: 'hideSuggestContent',
    cssClass: 'dt-hide-suggest-content',
    category: 'header',
    section: 'header-controls',
    defaultValue: false,
    label: 'Hide Suggest Title',
    description: 'Removes top content filters',
    icon: 'Layers',
  },

  // =========================================================================
  // SIDEBAR — Navigation
  // =========================================================================
  {
    key: 'hideHome',
    cssClass: 'dt-hide-home',
    category: 'sidebar',
    section: 'sidebar-navigation',
    defaultValue: false,
    label: 'Hide Home',
    description: 'Removes home guide entry',
    icon: 'Home',
  },
  {
    key: 'hideShorts',
    cssClass: 'dt-hide-shorts',
    category: 'sidebar',
    section: 'sidebar-navigation',
    defaultValue: false,
    label: 'Hide Shorts',
    description: 'Removes shorts guide entry',
    icon: 'Zap',
  },
  {
    key: 'hideSubscriptions',
    cssClass: 'dt-hide-subscriptions',
    category: 'sidebar',
    section: 'sidebar-navigation',
    defaultValue: false,
    label: 'Hide Subscriptions',
    description: 'Removes subscriptions list',
    icon: 'Library',
  },

  // =========================================================================
  // SIDEBAR — You Section
  // =========================================================================
  {
    key: 'hideYouSection',
    cssClass: 'dt-hide-you-section',
    category: 'sidebar',
    section: 'sidebar-you',
    defaultValue: false,
    label: 'Hide You Section',
    description: 'Master toggle for your content',
    icon: 'User',
  },
  {
    key: 'hideHistory',
    cssClass: 'dt-hide-history',
    category: 'sidebar',
    section: 'sidebar-you',
    defaultValue: false,
    label: 'Hide History',
    description: 'Removes watch history link',
    icon: 'Clock',
    parentKey: 'hideYouSection',
  },
  {
    key: 'hideYourChannel',
    cssClass: 'dt-hide-your-channel',
    category: 'sidebar',
    section: 'sidebar-you',
    defaultValue: false,
    label: 'Hide Your Channel',
    description: 'Removes channel profile link',
    icon: 'User',
    parentKey: 'hideYouSection',
    requiresLogin: true,
  },
  {
    key: 'hidePlaylists',
    cssClass: 'dt-hide-playlists',
    category: 'sidebar',
    section: 'sidebar-you',
    defaultValue: false,
    label: 'Hide Playlists',
    description: 'Removes all playlist links',
    icon: 'ListVideo',
    parentKey: 'hideYouSection',
    requiresLogin: true,
  },
  {
    key: 'hideWatchLater',
    cssClass: 'dt-hide-watch-later',
    category: 'sidebar',
    section: 'sidebar-you',
    defaultValue: false,
    label: 'Hide Watch Later',
    description: 'Removes specific folder',
    icon: 'Clock',
    parentKey: 'hideYouSection',
    requiresLogin: true,
  },
  {
    key: 'hideLikedVideos',
    cssClass: 'dt-hide-liked-videos',
    category: 'sidebar',
    section: 'sidebar-you',
    defaultValue: false,
    label: 'Hide Liked Videos',
    description: 'Removes your liked feed',
    icon: 'Heart',
    parentKey: 'hideYouSection',
    requiresLogin: true,
  },
  {
    key: 'hideYourVideos',
    cssClass: 'dt-hide-your-videos',
    category: 'sidebar',
    section: 'sidebar-you',
    defaultValue: false,
    label: 'Hide Your Videos',
    description: 'Removes link to your videos',
    icon: 'Video',
    parentKey: 'hideYouSection',
    requiresLogin: true,
  },
  {
    key: 'hideDownloads',
    cssClass: 'dt-hide-downloads',
    category: 'sidebar',
    section: 'sidebar-you',
    defaultValue: false,
    label: 'Hide Downloads',
    description: 'Removes offline content link',
    icon: 'Download',
    parentKey: 'hideYouSection',
    requiresLogin: true,
  },

  // =========================================================================
  // SIDEBAR — Explore
  // =========================================================================
  {
    key: 'hideExploreCategories',
    cssClass: 'dt-hide-explore-section',
    category: 'sidebar',
    section: 'sidebar-explore',
    defaultValue: false,
    label: 'Hide Explore Section',
    description: 'Master toggle for all categories',
    icon: 'Compass',
  },
  {
    key: 'hideShopping',
    cssClass: 'dt-hide-shopping',
    category: 'sidebar',
    section: 'sidebar-explore',
    defaultValue: false,
    label: 'Hide Shopping',
    description: 'Removes shopping category',
    icon: 'ShoppingBag',
    parentKey: 'hideExploreCategories',
  },
  {
    key: 'hideMusic',
    cssClass: 'dt-hide-music',
    category: 'sidebar',
    section: 'sidebar-explore',
    defaultValue: false,
    label: 'Hide Music',
    description: 'Removes music category',
    icon: 'Music',
    parentKey: 'hideExploreCategories',
  },
  {
    key: 'hideFilms',
    cssClass: 'dt-hide-films',
    category: 'sidebar',
    section: 'sidebar-explore',
    defaultValue: false,
    label: 'Hide Films',
    description: 'Removes movies and films',
    icon: 'Film',
    parentKey: 'hideExploreCategories',
  },
  {
    key: 'hideLive',
    cssClass: 'dt-hide-live',
    category: 'sidebar',
    section: 'sidebar-explore',
    defaultValue: false,
    label: 'Hide Live',
    description: 'Removes live category',
    icon: 'Radio',
    parentKey: 'hideExploreCategories',
  },
  {
    key: 'hideGaming',
    cssClass: 'dt-hide-gaming',
    category: 'sidebar',
    section: 'sidebar-explore',
    defaultValue: false,
    label: 'Hide Gaming',
    description: 'Removes gaming category',
    icon: 'Gamepad2',
    parentKey: 'hideExploreCategories',
  },
  {
    key: 'hideNews',
    cssClass: 'dt-hide-news',
    category: 'sidebar',
    section: 'sidebar-explore',
    defaultValue: false,
    label: 'Hide News',
    description: 'Removes news category',
    icon: 'Newspaper',
    parentKey: 'hideExploreCategories',
  },
  {
    key: 'hideSports',
    cssClass: 'dt-hide-sports',
    category: 'sidebar',
    section: 'sidebar-explore',
    defaultValue: false,
    label: 'Hide Sports',
    description: 'Removes sports category',
    icon: 'Trophy',
    parentKey: 'hideExploreCategories',
  },
  {
    key: 'hideCourses',
    cssClass: 'dt-hide-courses',
    category: 'sidebar',
    section: 'sidebar-explore',
    defaultValue: false,
    label: 'Hide Courses',
    description: 'Removes courses category',
    icon: 'GraduationCap',
    parentKey: 'hideExploreCategories',
  },
  {
    key: 'hideFashion',
    cssClass: 'dt-hide-fashion',
    category: 'sidebar',
    section: 'sidebar-explore',
    defaultValue: false,
    label: 'Hide Fashion & Beauty',
    description: 'Removes fashion category',
    icon: 'Shirt',
    parentKey: 'hideExploreCategories',
  },
  {
    key: 'hidePodcasts',
    cssClass: 'dt-hide-podcasts',
    category: 'sidebar',
    section: 'sidebar-explore',
    defaultValue: false,
    label: 'Hide Podcasts',
    description: 'Removes podcasts category',
    icon: 'Podcast',
    parentKey: 'hideExploreCategories',
  },
  {
    key: 'hidePlayables',
    cssClass: 'dt-hide-playables',
    category: 'sidebar',
    section: 'sidebar-explore',
    defaultValue: false,
    label: 'Hide Playables',
    description: 'Removes playables category',
    icon: 'Joystick',
    parentKey: 'hideExploreCategories',
  },

  // =========================================================================
  // SIDEBAR — More from YouTube
  // =========================================================================
  {
    key: 'hideMoreFromYoutube',
    cssClass: 'dt-hide-more-from-youtube',
    category: 'sidebar',
    section: 'sidebar-more',
    defaultValue: false,
    label: 'Hide More About YouTube',
    description: 'Master toggle for this section',
    icon: 'Youtube',
  },
  {
    key: 'hidePremium',
    cssClass: 'dt-hide-premium',
    category: 'sidebar',
    section: 'sidebar-more',
    defaultValue: false,
    label: 'Hide YouTube Premium',
    description: 'Removes premium link',
    icon: 'Youtube',
    parentKey: 'hideMoreFromYoutube',
  },
  {
    key: 'hideStudio',
    cssClass: 'dt-hide-studio',
    category: 'sidebar',
    section: 'sidebar-more',
    defaultValue: false,
    label: 'Hide YouTube Studio',
    description: 'Removes studio link',
    icon: 'Monitor',
    parentKey: 'hideMoreFromYoutube',
  },
  {
    key: 'hideMusicPremium',
    cssClass: 'dt-hide-music-premium',
    category: 'sidebar',
    section: 'sidebar-more',
    defaultValue: false,
    label: 'Hide YouTube Music',
    description: 'Removes music link',
    icon: 'Music',
    parentKey: 'hideMoreFromYoutube',
  },
  {
    key: 'hideKids',
    cssClass: 'dt-hide-kids',
    category: 'sidebar',
    section: 'sidebar-more',
    defaultValue: false,
    label: 'Hide YouTube Kids',
    description: 'Removes kids link',
    icon: 'Tv2',
    parentKey: 'hideMoreFromYoutube',
  },

  // =========================================================================
  // HOMEPAGE
  // =========================================================================
  {
    key: 'hideHomeRecommendations',
    cssClass: 'dt-hide-home-recommendations',
    category: 'homepage',
    section: 'homepage-feed',
    defaultValue: false,
    label: 'Hide Feed Recommendations',
    description: 'Removes main algorithm grid',
    icon: 'Home',
  },
  {
    key: 'hideShortsSection',
    cssClass: 'dt-hide-shorts-section',
    category: 'homepage',
    section: 'homepage-feed',
    defaultValue: false,
    label: 'Hide Shorts Shelf',
    description: 'Removes shorts from grid',
    icon: 'Zap',
  },

  // =========================================================================
  // VIDEO PAGE — Layout & Player
  // =========================================================================
  {
    key: 'centerPlayer',
    cssClass: 'dt-center-player',
    category: 'videopage',
    section: 'video-layout',
    defaultValue: false,
    label: 'Hide Sidebar (Center View)',
    description: 'Cinematic focused view',
    icon: 'Monitor',
  },
  {
    key: 'hideRelatedVideos',
    cssClass: 'dt-hide-related-videos',
    category: 'videopage',
    section: 'video-layout',
    defaultValue: false,
    label: 'Hide Related Videos',
    description: 'Removes sidebar suggestions',
    icon: 'Layout',
  },
  {
    key: 'grayscaleVideo',
    cssClass: 'dt-grayscale-video',
    category: 'videopage',
    section: 'video-layout',
    defaultValue: false,
    label: 'Hide Colors (Grayscale)',
    description: 'Remove color from player',
    icon: 'Palette',
  },
  {
    key: 'hideEndScreenSuggestions',
    cssClass: 'dt-hide-end-screen-suggestions',
    category: 'videopage',
    section: 'video-layout',
    defaultValue: false,
    label: 'Hide End Screen Cards',
    description: 'Removes post-video suggestions',
    icon: 'PlayCircle',
  },

  // =========================================================================
  // VIDEO PAGE — Interactions
  // =========================================================================
  {
    key: 'hideSubscribe',
    cssClass: 'dt-hide-subscribe',
    category: 'videopage',
    section: 'video-interactions',
    defaultValue: false,
    label: 'Hide Subscribe Button',
    description: 'Removes subscribe button',
    icon: 'Heart',
  },
  {
    key: 'hideJoinButton',
    cssClass: 'dt-hide-join-button',
    category: 'videopage',
    section: 'video-interactions',
    defaultValue: false,
    label: 'Hide Join Button',
    description: 'Removes membership join button',
    icon: 'Users',
  },
  {
    key: 'hideDownloadButtonVideo',
    cssClass: 'dt-hide-download-button-video',
    category: 'videopage',
    section: 'video-interactions',
    defaultValue: false,
    label: 'Hide Download Button',
    description: 'Removes video download button',
    icon: 'Download',
  },
  {
    key: 'hideShareButton',
    cssClass: 'dt-hide-share-button',
    category: 'videopage',
    section: 'video-interactions',
    defaultValue: false,
    label: 'Hide Share Button',
    description: 'Removes video share button',
    icon: 'Share2',
  },
  {
    key: 'hideLikes',
    cssClass: 'dt-hide-likes',
    category: 'videopage',
    section: 'video-interactions',
    defaultValue: false,
    label: 'Hide Social Metrics',
    description: 'Removes likes and view counts',
    icon: 'Heart',
  },

  // =========================================================================
  // VIDEO PAGE — Content
  // =========================================================================
  {
    key: 'hideDescription',
    cssClass: 'dt-hide-description',
    category: 'videopage',
    section: 'video-content',
    defaultValue: false,
    label: 'Hide Description',
    description: 'Removes video description box',
    icon: 'FileText',
  },
  {
    key: 'hideComments',
    cssClass: 'dt-hide-comments',
    category: 'videopage',
    section: 'video-content',
    defaultValue: false,
    label: 'Hide Comments',
    description: 'Removes video comment section',
    icon: 'MessageSquare',
  },

  // =========================================================================
  // CHANNEL PAGE — Stats & Branding
  // =========================================================================
  {
    key: 'hideChannelName',
    cssClass: 'dt-hide-channel-name',
    category: 'channelpage',
    section: 'channel-branding',
    defaultValue: false,
    label: 'Hide Channel Name',
    description: 'Removes the channel title',
    icon: 'User',
  },
  {
    key: 'hideChannelHandle',
    cssClass: 'dt-hide-channel-handle',
    category: 'channelpage',
    section: 'channel-branding',
    defaultValue: false,
    label: 'Hide Channel Handle',
    description: 'Removes the @username',
    icon: 'AtSign',
  },
  {
    key: 'hideSubscriberCount',
    cssClass: 'dt-hide-subscriber-count',
    category: 'channelpage',
    section: 'channel-branding',
    defaultValue: false,
    label: 'Hide Subscriber Count',
    description: 'Removes the number of subs',
    icon: 'Users',
  },
  {
    key: 'hideVideoCount',
    cssClass: 'dt-hide-video-count',
    category: 'channelpage',
    section: 'channel-branding',
    defaultValue: false,
    label: 'Hide Video Count',
    description: 'Removes the total video count',
    icon: 'Play',
  },
  {
    key: 'hideChannelMembers',
    cssClass: 'dt-hide-channel-members',
    category: 'channelpage',
    section: 'channel-branding',
    defaultValue: false,
    label: 'Hide Channel Members',
    description: 'Removes the members shelf',
    icon: 'Users',
  },

  // =========================================================================
  // CHANNEL PAGE — Navigation Tabs
  // =========================================================================
  {
    key: 'hideChannelTabs',
    cssClass: 'dt-hide-channel-tabs',
    category: 'channelpage',
    section: 'channel-tabs',
    defaultValue: false,
    label: 'Hide All Tabs',
    description: 'Removes the entire tab bar',
    icon: 'Settings',
  },
  {
    key: 'hideChannelHome',
    cssClass: 'dt-hide-channel-home',
    category: 'channelpage',
    section: 'channel-tabs',
    defaultValue: false,
    label: 'Hide Home Tab',
    description: 'Removes the channel home tab',
    icon: 'Home',
    parentKey: 'hideChannelTabs',
  },
  {
    key: 'hideChannelVideos',
    cssClass: 'dt-hide-channel-videos',
    category: 'channelpage',
    section: 'channel-tabs',
    defaultValue: false,
    label: 'Hide Videos Tab',
    description: 'Removes the channel videos tab',
    icon: 'PlayCircle',
    parentKey: 'hideChannelTabs',
  },
  {
    key: 'hideChannelShorts',
    cssClass: 'dt-hide-channel-shorts',
    category: 'channelpage',
    section: 'channel-tabs',
    defaultValue: false,
    label: 'Hide Shorts Tab',
    description: 'Removes the channel shorts tab',
    icon: 'Zap',
    parentKey: 'hideChannelTabs',
  },
  {
    key: 'hideChannelLive',
    cssClass: 'dt-hide-channel-live',
    category: 'channelpage',
    section: 'channel-tabs',
    defaultValue: false,
    label: 'Hide Live Tab',
    description: 'Removes the channel live tab',
    icon: 'Monitor',
    parentKey: 'hideChannelTabs',
  },
  {
    key: 'hideChannelPlaylists',
    cssClass: 'dt-hide-channel-playlists',
    category: 'channelpage',
    section: 'channel-tabs',
    defaultValue: false,
    label: 'Hide Playlists Tab',
    description: 'Removes the channel playlists tab',
    icon: 'ListVideo',
    parentKey: 'hideChannelTabs',
  },
  {
    key: 'hideChannelPosts',
    cssClass: 'dt-hide-channel-posts',
    category: 'channelpage',
    section: 'channel-tabs',
    defaultValue: false,
    label: 'Hide Posts Tab',
    description: 'Removes the channel community tab',
    icon: 'MessageSquare',
    parentKey: 'hideChannelTabs',
  },
  {
    key: 'hideChannelSearch',
    cssClass: 'dt-hide-channel-search',
    category: 'channelpage',
    section: 'channel-tabs',
    defaultValue: false,
    label: 'Hide Channel Search',
    description: 'Removes search in tabs',
    icon: 'Search',
    parentKey: 'hideChannelTabs',
  },
];

// ---------------------------------------------------------------------------
// Derived helpers — used by storage, content script, and popup
// ---------------------------------------------------------------------------

/** All setting keys (e.g. ['hideSearch', 'hideVoiceSearch', ...]) */
export const ALL_SETTING_KEYS = SETTING_REGISTRY.map(s => s.key);

/** Map: settingKey → cssClass (e.g. { hideSearch: 'dt-hide-search' }) */
export const SETTING_TO_CSS_CLASS: Record<string, string> = Object.fromEntries(
  SETTING_REGISTRY.map(s => [s.key, s.cssClass])
);

/** Build default values object from registry */
export function buildDefaults(): Record<string, boolean> {
  const defaults: Record<string, boolean> = { enabled: false };
  for (const s of SETTING_REGISTRY) {
    defaults[s.key] = s.defaultValue;
  }
  return defaults;
}

/** Get settings grouped by category, then by section */
export function getSettingsByCategory(category: SettingCategory): SettingDefinition[] {
  return SETTING_REGISTRY.filter(s => s.category === category);
}

/** Get unique sections in order for a category */
export function getSectionsForCategory(category: SettingCategory): SettingSection[] {
  const seen = new Set<SettingSection>();
  const sections: SettingSection[] = [];
  for (const s of SETTING_REGISTRY) {
    if (s.category === category && !seen.has(s.section)) {
      seen.add(s.section);
      sections.push(s.section);
    }
  }
  return sections;
}
