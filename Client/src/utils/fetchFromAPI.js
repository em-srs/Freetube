import axios from 'axios';

export const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

export const fetchFromAPI = async (url, customParams = {}) => {
  const options = {
    params: {
      maxResults: 50,
      _t: Date.now(), // Cache-busting parameter to ensure fresh content on every refresh
      ...customParams,
    },
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
      'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
  };

  const { data } = await axios.get(`${BASE_URL}/${url}`, options);

  return data;
};
