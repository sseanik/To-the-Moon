import * as config from "../config.json";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

const forumAPI = {
  addParent: (stockTicker: string, timestamp: number, content: string) => {
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
  addChild: (
    stockTicker: string,
    timestamp: number,
    content: string,
    parentID: string
  ) => {
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
  getComments: (stockTicker: string) => {
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
  editParent: (comment_id: string, time_stamp: number, content: string) => {
    const endpoint = "/forum/comment";
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        comment_id,
        time_stamp,
        content,
      }),
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  editChild: (
    comment_id: string,
    time_stamp: number,
    content: string,
    parent_id: string
  ) => {
    const endpoint = "/forum/reply";
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        comment_id,
        time_stamp,
        content,
        parent_id,
      }),
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  deleteParent: (comment_id: string) => {
    const endpoint = "/forum/deleteComment";
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        comment_id,
      }),
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  deleteChild: (comment_id: string, parent_id: string) => {
    const endpoint = "/forum/deleteReply";
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        comment_id,
        parent_id,
      }),
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
};

export default forumAPI;
