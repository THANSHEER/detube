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

export type SettingCategory = 'header' | 'sidebar' | 'homepage' | 'videopage' | 'channelpage' | 'shortspage';

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
  | 'channel-tabs'
  // Shorts page
  | 'shorts-player';

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
  'shorts-player': 'Shorts Player',
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
    icon: 'Search',
  },
  {
    key: 'hideVoiceSearch',
    cssClass: 'dt-hide-voice-search',
    category: 'header',
    section: 'header-controls',
    defaultValue: false,
    label: 'Hide Voice Search',
    icon: 'Mic',
  },
  {
    key: 'hideNotifications',
    cssClass: 'dt-hide-notifications',
    category: 'header',
    section: 'header-controls',
    defaultValue: false,
    label: 'Hide Notifications',
    icon: 'Bell',
  },
  {
    key: 'hideCreateButton',
    cssClass: 'dt-hide-create-button',
    category: 'header',
    section: 'header-controls',
    defaultValue: false,
    label: 'Hide Create Button',
    icon: 'PlusSquare',
  },
  {
    key: 'hideSuggestContent',
    cssClass: 'dt-hide-suggest-content',
    category: 'header',
    section: 'header-controls',
    defaultValue: false,
    label: 'Hide Suggest Title',
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
    icon: 'Home',
  },
  {
    key: 'hideShorts',
    cssClass: 'dt-hide-shorts',
    category: 'sidebar',
    section: 'sidebar-navigation',
    defaultValue: false,
    label: 'Hide Shorts',
    icon: 'Zap',
  },
  {
    key: 'hideSubscriptions',
    cssClass: 'dt-hide-subscriptions',
    category: 'sidebar',
    section: 'sidebar-navigation',
    defaultValue: false,
    label: 'Hide Subscriptions',
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
    icon: 'User',
  },
  {
    key: 'hideHistory',
    cssClass: 'dt-hide-history',
    category: 'sidebar',
    section: 'sidebar-you',
    defaultValue: false,
    label: 'Hide History',
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
    icon: 'Compass',
  },
  {
    key: 'hideShopping',
    cssClass: 'dt-hide-shopping',
    category: 'sidebar',
    section: 'sidebar-explore',
    defaultValue: false,
    label: 'Hide Shopping',
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
    icon: 'Youtube',
  },
  {
    key: 'hidePremium',
    cssClass: 'dt-hide-premium',
    category: 'sidebar',
    section: 'sidebar-more',
    defaultValue: false,
    label: 'Hide YouTube Premium',
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
    icon: 'Home',
  },
  {
    key: 'hideShortsSection',
    cssClass: 'dt-hide-shorts-section',
    category: 'homepage',
    section: 'homepage-feed',
    defaultValue: false,
    label: 'Hide Shorts Shelf',
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
    icon: 'Monitor',
  },
  {
    key: 'hideRelatedVideos',
    cssClass: 'dt-hide-related-videos',
    category: 'videopage',
    section: 'video-layout',
    defaultValue: false,
    label: 'Hide Related Videos',
    icon: 'Layout',
  },
  {
    key: 'grayscaleVideo',
    cssClass: 'dt-grayscale-video',
    category: 'videopage',
    section: 'video-layout',
    defaultValue: false,
    label: 'Hide Colors (Grayscale)',
    icon: 'Palette',
  },
  {
    key: 'hideEndScreenSuggestions',
    cssClass: 'dt-hide-end-screen-suggestions',
    category: 'videopage',
    section: 'video-layout',
    defaultValue: false,
    label: 'Hide End Screen Cards',
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
    icon: 'Heart',
  },
  {
    key: 'hideJoinButton',
    cssClass: 'dt-hide-join-button',
    category: 'videopage',
    section: 'video-interactions',
    defaultValue: false,
    label: 'Hide Join Button',
    icon: 'Users',
  },
  {
    key: 'hideDownloadButtonVideo',
    cssClass: 'dt-hide-download-button-video',
    category: 'videopage',
    section: 'video-interactions',
    defaultValue: false,
    label: 'Hide Download Button',
    icon: 'Download',
  },
  {
    key: 'hideShareButton',
    cssClass: 'dt-hide-share-button',
    category: 'videopage',
    section: 'video-interactions',
    defaultValue: false,
    label: 'Hide Share Button',
    icon: 'Share2',
  },
  {
    key: 'hideLikes',
    cssClass: 'dt-hide-likes',
    category: 'videopage',
    section: 'video-interactions',
    defaultValue: false,
    label: 'Hide Social Metrics',
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
    icon: 'FileText',
  },
  {
    key: 'hideComments',
    cssClass: 'dt-hide-comments',
    category: 'videopage',
    section: 'video-content',
    defaultValue: false,
    label: 'Hide Comments',
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
    icon: 'User',
  },
  {
    key: 'hideChannelHandle',
    cssClass: 'dt-hide-channel-handle',
    category: 'channelpage',
    section: 'channel-branding',
    defaultValue: false,
    label: 'Hide Channel Handle',
    icon: 'AtSign',
  },
  {
    key: 'hideSubscriberCount',
    cssClass: 'dt-hide-subscriber-count',
    category: 'channelpage',
    section: 'channel-branding',
    defaultValue: false,
    label: 'Hide Subscriber Count',
    icon: 'Users',
  },
  {
    key: 'hideVideoCount',
    cssClass: 'dt-hide-video-count',
    category: 'channelpage',
    section: 'channel-branding',
    defaultValue: false,
    label: 'Hide Video Count',
    icon: 'Play',
  },
  {
    key: 'hideChannelMembers',
    cssClass: 'dt-hide-channel-members',
    category: 'channelpage',
    section: 'channel-branding',
    defaultValue: false,
    label: 'Hide Channel Members',
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
    icon: 'Settings',
  },
  {
    key: 'hideChannelHome',
    cssClass: 'dt-hide-channel-home',
    category: 'channelpage',
    section: 'channel-tabs',
    defaultValue: false,
    label: 'Hide Home Tab',
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
    icon: 'Search',
    parentKey: 'hideChannelTabs',
  },

  // =========================================================================
  // SHORTS PAGE
  // =========================================================================
  {
    key: 'hideShortsAutoplay',
    cssClass: 'dt-hide-shorts-autoplay',
    category: 'shortspage',
    section: 'shorts-player',
    defaultValue: false,
    label: 'Hide Autoplay Next',
    icon: 'Zap',
  },
  {
    key: 'hideShortsAutoScroll',
    cssClass: 'dt-hide-shorts-auto-scroll',
    category: 'shortspage',
    section: 'shorts-player',
    defaultValue: false,
    label: 'Hide Auto Scroll Button',
    icon: 'Play',
  },
  {
    key: 'hideShortsLikeButton',
    cssClass: 'dt-hide-shorts-like-button',
    category: 'shortspage',
    section: 'shorts-player',
    defaultValue: false,
    label: 'Hide Like Button',
    icon: 'Heart',
  },
  {
    key: 'hideShortsLikeCount',
    cssClass: 'dt-hide-shorts-like-count',
    category: 'shortspage',
    section: 'shorts-player',
    defaultValue: false,
    label: 'Hide Like Count',
    icon: 'Heart',
    parentKey: 'hideShortsLikeButton',
  },
  {
    key: 'hideShortsDislikeButton',
    cssClass: 'dt-hide-shorts-dislike-button',
    category: 'shortspage',
    section: 'shorts-player',
    defaultValue: false,
    label: 'Hide Dislike Button',
    icon: 'Heart',
  },
  {
    key: 'hideShortsCommentButton',
    cssClass: 'dt-hide-shorts-comment-button',
    category: 'shortspage',
    section: 'shorts-player',
    defaultValue: false,
    label: 'Hide Comment Button',
    icon: 'MessageSquare',
  },
  {
    key: 'hideShortsCommentCount',
    cssClass: 'dt-hide-shorts-comment-count',
    category: 'shortspage',
    section: 'shorts-player',
    defaultValue: false,
    label: 'Hide Comment Count',
    icon: 'MessageSquare',
    parentKey: 'hideShortsCommentButton',
  },
  {
    key: 'hideShortsShare',
    cssClass: 'dt-hide-shorts-share',
    category: 'shortspage',
    section: 'shorts-player',
    defaultValue: false,
    label: 'Hide Share Button',
    icon: 'Share2',
  },
  {
    key: 'hideShortsRemixButton',
    cssClass: 'dt-hide-shorts-remix-button',
    category: 'shortspage',
    section: 'shorts-player',
    defaultValue: false,
    label: 'Hide Remix Button',
    icon: 'Scissors',
  },
  {
    key: 'hideShortsRemixCount',
    cssClass: 'dt-hide-shorts-remix-count',
    category: 'shortspage',
    section: 'shorts-player',
    defaultValue: false,
    label: 'Hide Remix Count',
    icon: 'Scissors',
    parentKey: 'hideShortsRemixButton',
  },
  {
    key: 'hideShortsSidebar',
    cssClass: 'dt-hide-shorts-sidebar',
    category: 'shortspage',
    section: 'shorts-player',
    defaultValue: false,
    label: 'Hide Related Shelf',
    icon: 'Layout',
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
