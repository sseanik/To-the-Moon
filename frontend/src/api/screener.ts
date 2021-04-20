import * as config from "../config.json";
import { ScreenerQuery } from "../helpers/ScreenerQuery";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

const ScreenerAPI = {
  save: (name: string, parameters: ScreenerQuery) => {
    const endpoint = `/screener/save?name=${name}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify(parameters),
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  load: () => {
    const endpoint = `/screener/load`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  delete: (name: string) => {
    const endpoint = `/screener/delete?name=${name}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getData: (parameters: string) => {
    const endpoint = `/screener`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      // body: JSON.stringify(parameters),
    };

    return Utils.getJSON(`${url}${endpoint}${parameters}`, options);
  },
};

export default ScreenerAPI;
