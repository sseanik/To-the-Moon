import * as config from "../config.json";
import Utils from "./utils";

const url = config.API;

const AuthAPI = {
  register: (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
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
  login: (email: string, password: string) => {
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
