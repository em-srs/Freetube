import axios from 'axios';

export const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

const defaultOptions = {
  params: {
    maxResults: 50,
    regionCode: 'IN',
  },
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
  },
};

export const fetchFromAPI = async (url, customParams = {}) => {
  const options = {
    ...defaultOptions,
    params: {
      ...defaultOptions.params,
      ...customParams,
    },
  };
  const { data } = await axios.get(`${BASE_URL}/${url}`, options);

  return data;
};
