// Client-Side Recommendation & Interest Model for Vision Hub

const HISTORY_KEY = 'visionhub_watch_history';
const LIKED_KEY = 'visionhub_liked_videos';
const SAVED_KEY = 'visionhub_saved_videos';
const SEARCHES_KEY = 'visionhub_searches';
const WEIGHTS_KEY = 'visionhub_topic_weights';

// Helper to safely parse localStorage JSON
const getStorageItem = (key, fallback = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

// Extract meaningful keywords from titles and search terms
const extractKeywords = (text = '') => {
  if (!text) return [];
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
    'did', 'video', 'youtube', 'official', 'hd', 'full', 'song', 'live', '2025', '2026', '2024'
  ]);
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
};

// Update topic weights in localStorage
const updateWeights = (keywords, scoreMultiplier = 1) => {
  const weights = getStorageItem(WEIGHTS_KEY, {});
  keywords.forEach(word => {
    weights[word] = (weights[word] || 0) + scoreMultiplier;
  });
  setStorageItem(WEIGHTS_KEY, weights);
};

// Track when a user views a video
export const trackVideoView = (video) => {
  if (!video || (!video.id?.videoId && !video.id)) return;
  
  const videoId = video.id?.videoId || video.id;
  const history = getStorageItem(HISTORY_KEY, []);
  
  // Remove duplicate if exists
  const filtered = history.filter(item => (item.id?.videoId || item.id) !== videoId);
  const newItem = {
    ...video,
    viewedAt: Date.now()
  };
  
  // Keep last 50 items
  const updatedHistory = [newItem, ...filtered].slice(0, 50);
  setStorageItem(HISTORY_KEY, updatedHistory);

  // Extract keywords from title and channel title
  const title = video.snippet?.title || '';
  const channelTitle = video.snippet?.channelTitle || '';
  const keywords = extractKeywords(`${title} ${channelTitle}`);
  updateWeights(keywords, 2);
};

// Track search query
export const trackSearch = (query) => {
  if (!query || typeof query !== 'string') return;
  const searches = getStorageItem(SEARCHES_KEY, []);
  const filtered = searches.filter(q => q.toLowerCase() !== query.toLowerCase());
  setStorageItem(SEARCHES_KEY, [query, ...filtered].slice(0, 30));

  const keywords = extractKeywords(query);
  updateWeights(keywords, 3);
};

// Toggle Liked status for a video
export const toggleLikeVideo = (video) => {
  if (!video) return false;
  const videoId = video.id?.videoId || video.id;
  const liked = getStorageItem(LIKED_KEY, []);
  const exists = liked.some(item => (item.id?.videoId || item.id) === videoId);

  let updated;
  if (exists) {
    updated = liked.filter(item => (item.id?.videoId || item.id) !== videoId);
  } else {
    updated = [{ ...video, likedAt: Date.now() }, ...liked];
    const keywords = extractKeywords(video.snippet?.title || '');
    updateWeights(keywords, 4);
  }
  setStorageItem(LIKED_KEY, updated);
  return !exists;
};

export const isVideoLiked = (videoId) => {
  if (!videoId) return false;
  const liked = getStorageItem(LIKED_KEY, []);
  return liked.some(item => (item.id?.videoId || item.id) === videoId);
};

// Toggle Save to Watch Later
export const toggleSaveVideo = (video) => {
  if (!video) return false;
  const videoId = video.id?.videoId || video.id;
  const saved = getStorageItem(SAVED_KEY, []);
  const exists = saved.some(item => (item.id?.videoId || item.id) === videoId);

  let updated;
  if (exists) {
    updated = saved.filter(item => (item.id?.videoId || item.id) !== videoId);
  } else {
    updated = [{ ...video, savedAt: Date.now() }, ...saved];
  }
  setStorageItem(SAVED_KEY, updated);
  return !exists;
};

export const isVideoSaved = (videoId) => {
  if (!videoId) return false;
  const saved = getStorageItem(SAVED_KEY, []);
  return saved.some(item => (item.id?.videoId || item.id) === videoId);
};

// Getters for history, liked, saved
export const getWatchHistory = () => getStorageItem(HISTORY_KEY, []);
export const getLikedVideos = () => getStorageItem(LIKED_KEY, []);
export const getSavedVideos = () => getStorageItem(SAVED_KEY, []);

// Get top weighted interest topics for personalized queries
export const getTopInterestTopics = (limit = 3) => {
  const weights = getStorageItem(WEIGHTS_KEY, {});
  const sorted = Object.entries(weights)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  if (sorted.length > 0) {
    return sorted.slice(0, limit);
  }
  // Default Indian trending topics fallback
  return ['Trending India', 'Bollywood', 'Indian Tech'];
};

// Generates primary query string for personalized feed
export const getPersonalizedSearchQuery = () => {
  const topTopics = getTopInterestTopics(2);
  const history = getWatchHistory();

  if (history.length > 0) {
    const recentTitle = history[0].snippet?.title || '';
    const keywords = extractKeywords(recentTitle).slice(0, 2);
    if (keywords.length > 0) {
      return `${keywords.join(' ')} ${topTopics[0] || 'India'}`;
    }
  }

  return topTopics.join(' ');
};
