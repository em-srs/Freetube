import axios from 'axios';

export const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

// Extract keys from environment (supports comma-separated string of multiple API keys)
const rawKeys = process.env.REACT_APP_RAPID_API_KEY || '';
const apiKeys = rawKeys.split(',').map(k => k.trim()).filter(Boolean);

let currentKeyIndex = 0;

const getActiveApiKey = () => {
  if (apiKeys.length === 0) return '';
  return apiKeys[currentKeyIndex % apiKeys.length];
};

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

const getCachedData = (cacheKey) => {
  try {
    const cached = sessionStorage.getItem(`vh_cache_${cacheKey}`);
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
    sessionStorage.setItem(
      `vh_cache_${cacheKey}`,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch (e) {
    // Ignore storage errors
  }
};

export const fetchFromAPI = async (url, customParams = {}) => {
  const cacheKey = `${url}_${JSON.stringify(customParams)}`;
  const cachedResult = getCachedData(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

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
      if (data) {
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
  return staleData || { items: [] };
};
