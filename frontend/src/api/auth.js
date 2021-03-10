import * as config from '../config.json';
import Utils from './utils';

const url = `http://localhost:${config.BACKEND_PORT}`;

const AuthAPI = {
  register: (email, password, name) => {
    const endpoint = '/register';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    };

    return { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhheWRlbkB1bnN3LmVkdS5hdSIsImlhdCI6MTYwMzk0MzIzMH0.b37PfwlcH_cue6yhgvDt2IiNvhRACf79hTNtacYB94Q" }
    // return Utils.getJSON(`${url}${endpoint}`, options);
  },
  login: (email, password) => {
    const endpoint = '/login';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    };

    return { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhheWRlbkB1bnN3LmVkdS5hdSIsImlhdCI6MTYwMzk0MzIzMH0.b37PfwlcH_cue6yhgvDt2IiNvhRACf79hTNtacYB94Q" }
    // return Utils.getJSON(`${url}${endpoint}`, options);
  },
  logout: () => {
    const endpoint = '/logout';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Utils.getToken()}`,
      },
    };

    return {}
    // return Utils.getJSON(`${url}${endpoint}`, options);
  },
};

export default AuthAPI;
