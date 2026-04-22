// ===== Unified Language Map =====
// All Google Translate supported languages with all Indian languages
export const LANGUAGES = [
  // ── Indian Languages (Scheduled + Major) ──
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', group: 'Indian' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', group: 'Indian' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', group: 'Indian' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', group: 'Indian' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', group: 'Indian' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳', group: 'Indian' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', group: 'Indian' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', group: 'Indian' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', group: 'Indian' },
  { code: 'or', name: 'Odia', flag: '🇮🇳', group: 'Indian' },
  { code: 'as', name: 'Assamese', flag: '🇮🇳', group: 'Indian' },
  { code: 'ur', name: 'Urdu', flag: '🇮🇳', group: 'Indian' },
  { code: 'sd', name: 'Sindhi', flag: '🇮🇳', group: 'Indian' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵', group: 'Indian' },
  { code: 'sa', name: 'Sanskrit', flag: '🇮🇳', group: 'Indian' },
  { code: 'ks', name: 'Kashmiri', flag: '🇮🇳', group: 'Indian' },
  { code: 'doi', name: 'Dogri', flag: '🇮🇳', group: 'Indian' },
  { code: 'gom', name: 'Konkani', flag: '🇮🇳', group: 'Indian' },
  { code: 'mai', name: 'Maithili', flag: '🇮🇳', group: 'Indian' },
  { code: 'mni-Mtei', name: 'Manipuri', flag: '🇮🇳', group: 'Indian' },
  { code: 'sat', name: 'Santali', flag: '🇮🇳', group: 'Indian' },
  { code: 'brx', name: 'Bodo', flag: '🇮🇳', group: 'Indian' },

  // ── Popular International ──
  { code: 'en', name: 'English', flag: '🇬🇧', group: 'Popular' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', group: 'Popular' },
  { code: 'fr', name: 'French', flag: '🇫🇷', group: 'Popular' },
  { code: 'de', name: 'German', flag: '🇩🇪', group: 'Popular' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', group: 'Popular' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', group: 'Popular' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', group: 'Popular' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', group: 'Popular' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', group: 'Popular' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳', group: 'Popular' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇹🇼', group: 'Popular' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', group: 'Popular' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', group: 'Popular' },

  // ── East & Southeast Asian ──
  { code: 'th', name: 'Thai', flag: '🇹🇭', group: 'Asian' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', group: 'Asian' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', group: 'Asian' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', group: 'Asian' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭', group: 'Asian' },
  { code: 'my', name: 'Myanmar (Burmese)', flag: '🇲🇲', group: 'Asian' },
  { code: 'km', name: 'Khmer', flag: '🇰🇭', group: 'Asian' },
  { code: 'lo', name: 'Lao', flag: '🇱🇦', group: 'Asian' },
  { code: 'mn', name: 'Mongolian', flag: '🇲🇳', group: 'Asian' },
  { code: 'jw', name: 'Javanese', flag: '🇮🇩', group: 'Asian' },
  { code: 'su', name: 'Sundanese', flag: '🇮🇩', group: 'Asian' },
  { code: 'ceb', name: 'Cebuano', flag: '🇵🇭', group: 'Asian' },
  { code: 'hmn', name: 'Hmong', flag: '🌏', group: 'Asian' },

  // ── European ──
  { code: 'pl', name: 'Polish', flag: '🇵🇱', group: 'European' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', group: 'European' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', group: 'European' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰', group: 'European' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', group: 'European' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', group: 'European' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', group: 'European' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', group: 'European' },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸', group: 'European' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', group: 'European' },
  { code: 'bs', name: 'Bosnian', flag: '🇧🇦', group: 'European' },
  { code: 'mk', name: 'Macedonian', flag: '🇲🇰', group: 'European' },
  { code: 'sq', name: 'Albanian', flag: '🇦🇱', group: 'European' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', group: 'European' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', group: 'European' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', group: 'European' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', group: 'European' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', group: 'European' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', group: 'European' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', group: 'European' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻', group: 'European' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', group: 'European' },
  { code: 'is', name: 'Icelandic', flag: '🇮🇸', group: 'European' },
  { code: 'ga', name: 'Irish', flag: '🇮🇪', group: 'European' },
  { code: 'cy', name: 'Welsh', flag: '🏴', group: 'European' },
  { code: 'gd', name: 'Scottish Gaelic', flag: '🏴', group: 'European' },
  { code: 'eu', name: 'Basque', flag: '🇪🇸', group: 'European' },
  { code: 'ca', name: 'Catalan', flag: '🇪🇸', group: 'European' },
  { code: 'gl', name: 'Galician', flag: '🇪🇸', group: 'European' },
  { code: 'mt', name: 'Maltese', flag: '🇲🇹', group: 'European' },
  { code: 'lb', name: 'Luxembourgish', flag: '🇱🇺', group: 'European' },
  { code: 'be', name: 'Belarusian', flag: '🇧🇾', group: 'European' },
  { code: 'co', name: 'Corsican', flag: '🇫🇷', group: 'European' },
  { code: 'fy', name: 'Frisian', flag: '🇳🇱', group: 'European' },

  // ── Middle Eastern & Central Asian ──
  { code: 'fa', name: 'Persian', flag: '🇮🇷', group: 'Middle Eastern' },
  { code: 'iw', name: 'Hebrew', flag: '🇮🇱', group: 'Middle Eastern' },
  { code: 'ps', name: 'Pashto', flag: '🇦🇫', group: 'Middle Eastern' },
  { code: 'ku', name: 'Kurdish', flag: '🌍', group: 'Middle Eastern' },
  { code: 'az', name: 'Azerbaijani', flag: '🇦🇿', group: 'Middle Eastern' },
  { code: 'ka', name: 'Georgian', flag: '🇬🇪', group: 'Middle Eastern' },
  { code: 'hy', name: 'Armenian', flag: '🇦🇲', group: 'Middle Eastern' },
  { code: 'uz', name: 'Uzbek', flag: '🇺🇿', group: 'Middle Eastern' },
  { code: 'kk', name: 'Kazakh', flag: '🇰🇿', group: 'Middle Eastern' },
  { code: 'ky', name: 'Kyrgyz', flag: '🇰🇬', group: 'Middle Eastern' },
  { code: 'tg', name: 'Tajik', flag: '🇹🇯', group: 'Middle Eastern' },
  { code: 'tk', name: 'Turkmen', flag: '🇹🇲', group: 'Middle Eastern' },
  { code: 'ug', name: 'Uyghur', flag: '🇨🇳', group: 'Middle Eastern' },

  // ── African ──
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', group: 'African' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹', group: 'African' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬', group: 'African' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬', group: 'African' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬', group: 'African' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦', group: 'African' },
  { code: 'xh', name: 'Xhosa', flag: '🇿🇦', group: 'African' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', group: 'African' },
  { code: 'so', name: 'Somali', flag: '🇸🇴', group: 'African' },
  { code: 'mg', name: 'Malagasy', flag: '🇲🇬', group: 'African' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼', group: 'African' },
  { code: 'sn', name: 'Shona', flag: '🇿🇼', group: 'African' },
  { code: 'ti', name: 'Tigrinya', flag: '🇪🇷', group: 'African' },
  { code: 'lg', name: 'Luganda', flag: '🇺🇬', group: 'African' },
  { code: 'om', name: 'Oromo', flag: '🇪🇹', group: 'African' },
  { code: 'bm', name: 'Bambara', flag: '🇲🇱', group: 'African' },
  { code: 'ee', name: 'Ewe', flag: '🇬🇭', group: 'African' },
  { code: 'ln', name: 'Lingala', flag: '🇨🇩', group: 'African' },
  { code: 'nso', name: 'Sepedi', flag: '🇿🇦', group: 'African' },
  { code: 'st', name: 'Sesotho', flag: '🇱🇸', group: 'African' },
  { code: 'ny', name: 'Chichewa', flag: '🇲🇼', group: 'African' },

  // ── Other ──
  { code: 'la', name: 'Latin', flag: '🏛️', group: 'Other' },
  { code: 'eo', name: 'Esperanto', flag: '🌍', group: 'Other' },
  { code: 'haw', name: 'Hawaiian', flag: '🇺🇸', group: 'Other' },
  { code: 'sm', name: 'Samoan', flag: '🇼🇸', group: 'Other' },
  { code: 'mi', name: 'Maori', flag: '🇳🇿', group: 'Other' },
  { code: 'ht', name: 'Haitian Creole', flag: '🇭🇹', group: 'Other' },
  { code: 'yi', name: 'Yiddish', flag: '🌍', group: 'Other' },
];

// Build lookup map from code → name
export const LANG_MAP = {};
LANGUAGES.forEach((l) => {
  LANG_MAP[l.code] = l.name;
});

// Get language name from code
export function getLangName(code) {
  if (!code) return 'Unknown';
  return LANG_MAP[code] || code;
}

// Get language flag from code
export function getLangFlag(code) {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang?.flag || '🌐';
}

// Get avatar gradient class based on user id
export function getAvatarGradient(userId) {
  const gradients = 6;
  return `gradient-${(userId % gradients) + 1}`;
}

// Format timestamp for display
export function formatTime(ts) {
  if (!ts) return '';
  try {
    const parts = ts.split(' ');
    if (parts.length === 2) {
      return parts[1].substring(0, 5);
    }
    return ts;
  } catch {
    return ts;
  }
}

// Format timestamp for sidebar "time ago"
export function formatTimeAgo(ts) {
  if (!ts) return '';
  try {
    const parts = ts.split(' ');
    if (parts.length !== 2) return ts;

    const [datePart, timePart] = parts;
    const msgDate = new Date(`${datePart}T${timePart}`);
    const now = new Date();
    const diffMs = now - msgDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return timePart.substring(0, 5);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return msgDate.toLocaleDateString('en', { weekday: 'short' });
    return msgDate.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

// Format date for date separator
export function formatDateSeparator(ts) {
  if (!ts) return '';
  try {
    const parts = ts.split(' ');
    if (parts.length !== 2) return ts;

    const datePart = parts[0];
    const msgDate = new Date(datePart + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (msgDate.getTime() === today.getTime()) return 'Today';
    if (msgDate.getTime() === yesterday.getTime()) return 'Yesterday';
    return msgDate.toLocaleDateString('en', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: msgDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return '';
  }
}
