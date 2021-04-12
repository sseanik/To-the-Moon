import * as config from "../config.json";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

interface Header {
  "Content-Type": string;
  Authorization: string | null;
}

interface Options {
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers: Header;
  body?: string;
}

const watchlistAPI = {
  getWatchlists: () => {
    // will change
    const endpoint = "/user/watchlists";
    const options: Options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getFollowing: () => {
    // will change
    const endpoint = "/user/following";
    const options: Options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
};

export default watchlistAPI;
