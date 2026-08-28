import axios from 'axios';

export const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

// Function to collect all available keys (Environment + User Custom Keys in localStorage)
export const getApiKeysList = () => {
  const envKeysRaw = process.env.REACT_APP_RAPID_API_KEY || '';
  const customKeysRaw = localStorage.getItem('custom_rapid_api_key') || '';
  
  const combined = `${customKeysRaw},${envKeysRaw}`;
  return combined
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);
};

let currentKeyIndex = 0;

const getActiveApiKey = () => {
  const keys = getApiKeysList();
  if (keys.length === 0) return '';
  return keys[currentKeyIndex % keys.length];
};

export const setCustomApiKey = (keyString) => {
  if (keyString) {
    localStorage.setItem('custom_rapid_api_key', keyString.trim());
  } else {
    localStorage.removeItem('custom_rapid_api_key');
  }
  currentKeyIndex = 0;
};

export const getStoredCustomKey = () => {
  return localStorage.getItem('custom_rapid_api_key') || '';
};

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL

const getCachedData = (cacheKey) => {
  try {
    const cached = localStorage.getItem(`vh_cache_${cacheKey}`) || sessionStorage.getItem(`vh_cache_${cacheKey}`);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL_MS) {
        return data;
      }
    }
  } catch (e) {
    // Ignore storage errors
  }
  return null;
};

const setCachedData = (cacheKey, data) => {
  try {
    localStorage.setItem(
      `vh_cache_${cacheKey}`,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch (e) {
    // Fallback to sessionStorage if localStorage fails
    try {
      sessionStorage.setItem(
        `vh_cache_${cacheKey}`,
        JSON.stringify({ timestamp: Date.now(), data })
      );
    } catch (err) {}
  }
};

const FALLBACK_VIDEOS = {
  items: [
    {
      id: { videoId: "GDa8kZLNhJ4" },
      snippet: {
        title: "Build and Deploy a Full Stack React YouTube Clone Application",
        channelTitle: "JavaScript Mastery",
        channelId: "UCmXmlB4-HJytD7wek0Uo97A",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/GDa8kZLNhJ4/hqdefault.jpg" } }
      },
      contentDetails: { duration: "PT1H45M10S" }
    },
    {
      id: { videoId: "bMknfKXIFA8" },
      snippet: {
        title: "React Course - Beginner's Tutorial for Web Development 2026",
        channelTitle: "FreeCodeCamp",
        channelId: "UC8butISFwT-Wl7EV0hUK0BQ",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/bMknfKXIFA8/hqdefault.jpg" } }
      },
      contentDetails: { duration: "PT5H10M00S" }
    },
    {
      id: { videoId: "9bZkp7q19f0" },
      snippet: {
        title: "PSY - GANGNAM STYLE (강남스타일) M/V",
        channelTitle: "Official PSY",
        channelId: "UCrDkAvF_tYj1",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg" } }
      },
      contentDetails: { duration: "PT4M13S" }
    },
    {
      id: { videoId: "kJQP7kiw5Fk" },
      snippet: {
        title: "Luis Fonsi - Despacito ft. Daddy Yankee",
        channelTitle: "Luis Fonsi",
        channelId: "UCxo1M304Y8V3Q2a488g",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg" } }
      },
      contentDetails: { duration: "PT4M42S" }
    },
    {
      id: { videoId: "fJ9rUzIMcZQ" },
      snippet: {
        title: "Queen – Bohemian Rhapsody (Official Video Remastered)",
        channelTitle: "Queen Official",
        channelId: "UCG8rbF3g2AMX70yOd8vqIZg",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg" } }
      },
      contentDetails: { duration: "PT6M00S" }
    },
    {
      id: { videoId: "L_LUpnjgPso" },
      snippet: {
        title: "Top Coding Projects to Build in 2026 #shorts",
        channelTitle: "Tech Shorts",
        channelId: "UC12345",
        thumbnails: { high: { url: "https://i.ytimg.com/vi/L_LUpnjgPso/hqdefault.jpg" } }
      },
      contentDetails: { duration: "PT45S" }
    }
  ]
};

export const fetchFromAPI = async (url, customParams = {}) => {
  const cacheKey = `${url}_${JSON.stringify(customParams)}`;
  const cachedResult = getCachedData(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  const apiKeys = getApiKeysList();
  const initialKeyIndex = currentKeyIndex;
  let attempts = 0;
  const maxAttempts = Math.max(1, apiKeys.length);

  while (attempts < maxAttempts) {
    const apiKey = getActiveApiKey();
    const options = {
      params: {
        maxResults: 20,
        ...customParams,
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
      },
    };

    try {
      const { data } = await axios.get(`${BASE_URL}/${url}`, options);
      if (data && data.items) {
        setCachedData(cacheKey, data);
        return data;
      }
    } catch (error) {
      const status = error?.response?.status;
      // 429 = Quota Exceeded, 403 = Forbidden / Rate Limited
      if ((status === 429 || status === 403) && apiKeys.length > 1) {
        console.warn(`RapidAPI Key at index ${currentKeyIndex} hit quota/rate limit. Rotating key...`);
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        attempts++;
        if (currentKeyIndex === initialKeyIndex) {
          break;
        }
      } else {
        console.error('API Fetch Error:', error?.message || error);
        break;
      }
    }
  }

  const staleData = getCachedData(cacheKey);
  return staleData || FALLBACK_VIDEOS;
};
