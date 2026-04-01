// Hourly Design System — Icons
// Purposeful, nonchalant line icons using Feather
// No emojis — clean, professional aesthetic

import { Feather } from '@expo/vector-icons';

type FeatherIconName = keyof typeof Feather.glyphMap;

// Cause/category icons - used in onboarding, filters, and tags
export const CauseIcons: Record<string, FeatherIconName> = {
  Environment: 'globe',
  Education: 'book-open',
  Food: 'coffee',
  Animals: 'heart',
  Seniors: 'sun',
  Youth: 'users',
  Health: 'activity',
  Arts: 'edit-3',
  Community: 'home',
  Sports: 'target',
  Tech: 'code',
  Legal: 'shield',
};

// Navigation icons
export const NavIcons: Record<string, FeatherIconName> = {
  explore: 'search',
  shifts: 'calendar',
  portfolio: 'bar-chart-2',
  profile: 'user',
  dashboard: 'grid',
  events: 'calendar',
  applicants: 'users',
  orgProfile: 'briefcase',
  settings: 'settings',
  notifications: 'bell',
  messages: 'message-circle',
};

// Action icons
export const ActionIcons: Record<string, FeatherIconName> = {
  add: 'plus',
  remove: 'minus',
  close: 'x',
  back: 'arrow-left',
  forward: 'arrow-right',
  up: 'arrow-up',
  down: 'arrow-down',
  check: 'check',
  edit: 'edit-2',
  delete: 'trash-2',
  share: 'share',
  save: 'bookmark',
  filter: 'sliders',
  search: 'search',
  refresh: 'refresh-cw',
  more: 'more-horizontal',
  menu: 'menu',
  external: 'external-link',
  copy: 'copy',
  download: 'download',
  upload: 'upload',
};

// Status/info icons
export const StatusIcons: Record<string, FeatherIconName> = {
  success: 'check-circle',
  error: 'alert-circle',
  warning: 'alert-triangle',
  info: 'info',
  pending: 'clock',
  verified: 'check',
  locked: 'lock',
  unlocked: 'unlock',
  visible: 'eye',
  hidden: 'eye-off',
  favorite: 'heart',
  star: 'star',
};

// Detail/metadata icons
export const DetailIcons: Record<string, FeatherIconName> = {
  location: 'map-pin',
  distance: 'navigation',
  time: 'clock',
  date: 'calendar',
  duration: 'watch',
  hours: 'clock',
  credit: 'award',
  rating: 'star',
  spots: 'users',
  organization: 'briefcase',
  phone: 'phone',
  email: 'mail',
  website: 'globe',
  social: 'share-2',
};

// Feature/section icons
export const FeatureIcons: Record<string, FeatherIconName> = {
  qrCode: 'maximize',
  camera: 'camera',
  scan: 'aperture',
  map: 'map',
  list: 'list',
  grid: 'grid',
  chart: 'bar-chart-2',
  badge: 'award',
  certificate: 'file-text',
  trophy: 'award',
  streak: 'zap',
  milestone: 'flag',
};

// Icon sizes for consistency
export const IconSizes = {
  tiny: 12,
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 32,
  huge: 48,
};

// Export all icons in a single object for convenience
export const Icons = {
  cause: CauseIcons,
  nav: NavIcons,
  action: ActionIcons,
  status: StatusIcons,
  detail: DetailIcons,
  feature: FeatureIcons,
  sizes: IconSizes,
};

export default Icons;
