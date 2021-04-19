import * as config from "../config.json";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

const AuthAPI = {
  register: (username, firstName, lastName, email, password) => {
    const endpoint = "/user/register";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password,
      }),
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  login: (email, password) => {
    const endpoint = "/user/login";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getUsername: () => {
    const endpoint = "/user";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
};

export default AuthAPI;
