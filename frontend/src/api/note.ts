import * as config from "../config.json";
import Utils from "./utils";

const url = config.API;

const NoteAPI = {
  getUserNotes: () => {
    const endpoint = "/notes";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getRelevantNotes: (stocks: string[], portfolios: string[]) => {
    let endpoint = `/notes/relevant?`;
    for (const stock of stocks) {
      endpoint += `stock=${encodeURI(stock)}&`;
    }
    for (const portfolio of portfolios) {
      endpoint += `portfolio=${encodeURI(portfolio)}&`;
    }
    endpoint = endpoint.slice(0, -1);
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  createNote: (
    title: string,
    content: string,
    stock_symbols: string[],
    portfolio_names: string[],
    external_references: string[],
    internal_references: string[]
  ) => {
    const endpoint = "/notes";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        title,
        content,
        stock_symbols,
        portfolio_names,
        external_references,
        internal_references,
      }),
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  editNote: (
    old_title: string,
    new_title: string,
    content: string,
    stock_symbols: string[],
    portfolio_names: string[],
    external_references: string[],
    internal_references: string[]
  ) => {
    const endpoint = `/notes?note=${encodeURI(old_title)}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        new_title,
        content,
        stock_symbols,
        portfolio_names,
        external_references,
        internal_references,
      }),
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  deleteNote: (title: string) => {
    const endpoint = `/notes?title=${encodeURI(title)}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
};

export default NoteAPI;
