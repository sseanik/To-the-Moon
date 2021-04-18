import * as config from '../config.json';
import Utils from './utils';

const url = `http://localhost:${config.BACKEND_PORT}`;

const NewsAPI = {
  getFeaturedNews: (count = 5) => {
    const endpoint = `/news/general?count=${encodeURI(count)}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Utils.getToken()}`,
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getNewsByStock: (stock) => {
    const endpoint = `/news?symbol=${encodeURI(stock)}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Utils.getToken()}`,
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
};

export default NewsAPI;
