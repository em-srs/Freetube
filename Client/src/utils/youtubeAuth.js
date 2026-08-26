// Client-Side Google OAuth 2.0 & YouTube Account Integration

const TOKEN_KEY = 'visionhub_yt_token';
const USER_KEY = 'visionhub_yt_user_info';
const SUBS_KEY = 'visionhub_yt_subscriptions';

export const getStoredToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

export const getStoredUser = () => {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const getStoredSubscriptions = () => {
  try {
    const data = localStorage.getItem(SUBS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveAuthData = (token, user = null, subscriptions = []) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (subscriptions) localStorage.setItem(SUBS_KEY, JSON.stringify(subscriptions));
  } catch (e) {
    console.error('Failed to save auth data:', e);
  }
};

export const signOut = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SUBS_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Sign out error:', e);
  }
};

// Fetch Subscriptions using Google OAuth Access Token directly
export const fetchSubscriptionsWithToken = async (accessToken) => {
  try {
    const response = await fetch(
      'https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch subscriptions');
    const data = await response.json();
    return data.items || [];
  } catch (err) {
    console.error('Error fetching YouTube subscriptions:', err);
    return [];
  }
};

// Client-side Google Identity Services OAuth trigger
export const requestGoogleAuth = (onSuccess, onError) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  if (!clientId) {
    if (onError) onError('Missing REACT_APP_GOOGLE_CLIENT_ID environment variable.');
    return;
  }

  if (window.google?.accounts?.oauth2) {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
      callback: async (tokenResponse) => {
        if (tokenResponse.access_token) {
          const token = tokenResponse.access_token;
          const subs = await fetchSubscriptionsWithToken(token);
          saveAuthData(token, { connected: true, connectedAt: Date.now() }, subs);
          if (onSuccess) onSuccess({ token, subscriptions: subs });
        } else if (onError) {
          onError('Failed to obtain access token');
        }
      },
    });
    client.requestAccessToken();
  } else if (onError) {
    onError('Google Identity Services library not loaded yet.');
  }
};
