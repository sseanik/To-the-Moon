import * as config from "../config.json";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

const forumAPI = {
  addParent: (stockTicker, timestamp, content) => {
    const endpoint = "/forum/comment";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        stockTicker,
        timestamp,
        content,
      }),
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  addChild: (stockTicker, timestamp, content, parentID) => {
    const endpoint = "/forum/reply";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        stockTicker,
        timestamp,
        content,
        parentID,
      }),
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getComments: (stockTicker) => {
    const endpoint = `/forum?stockTicker=${stockTicker}`;
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

export default forumAPI;
