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
    const endpoint = "/watchlist";
    const options: Options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  addWatchlist: (payload: any) => {
    // will change
    const endpoint = "/user/watchlists";
    const options: Options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({ payload }),
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  deleteWatchlist: (watchlist_id: string) => {
    const endpoint = "/watchlist";
    const options: Options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({ watchlist_id }),
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getFollowing: () => {
    const endpoint = "/watchlist/userslist";
    const options: Options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  addFollowing: (watchlist_id: string) => {
    const endpoint = "/watchlist/subscribe";
    const options: Options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({ watchlist_id }),
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  deleteFollowing: (watchlist_id: string) => {
    const endpoint = "/watchlist/subscribe";
    const options: Options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({ watchlist_id }),
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
};

export default watchlistAPI;
