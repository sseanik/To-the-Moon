import * as config from "../config.json";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

const forumAPI = {
  addComment: (
    stockTicker: string,
    timestamp: number,
    content: string,
    parentID?: string
  ) => {
    const endpoint = `/forum/${parentID ? "reply" : "comment"}`;
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
    const endpoint = `/forum?stockTicker=${encodeURI(stockTicker)}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  editComment: (
    comment_id: string,
    time_stamp: number,
    content: string,
    parent_id?: string
  ) => {
    const endpoint = `/forum/${parent_id ? "reply" : "comment"}`;
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
  deleteComment: (comment_id: string, parent_id?: string) => {
    const endpoint = `/forum/${parent_id ? "reply" : "comment"}`;
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
  upvoteParent: (comment_id: string, remove = false) => {
    const endpoint = "/forum/comment/upvote";
    const options = {
      method: remove ? "DELETE" : "PUT",
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
  downvoteParent: (comment_id: string, remove = false) => {
    const endpoint = "/forum/comment/downvote";
    const options = {
      method: remove ? "DELETE" : "PUT",
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
  upvoteChild: (reply_id: string, comment_id: string, remove = false) => {
    const endpoint = "/forum/reply/upvote";
    const options = {
      method: remove ? "DELETE" : "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        reply_id,
        comment_id,
      }),
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  downvoteChild: (reply_id: string, comment_id: string, remove = false) => {
    const endpoint = "/forum/reply/downvote";
    const options = {
      method: remove ? "DELETE" : "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        reply_id,
        comment_id,
      }),
    };
    return Utils.getJSON(`${url}${endpoint}`, options);
  },
};

export default forumAPI;
