import * as config from "../config.json";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

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
  getRelevantNotes: (stocks, portfolios) => {
    let endpoint = `/notes/relevant?`;
    for (const stock of stocks) {
      endpoint += `stock=${stock}&`
    }
    for (const portfolio of portfolios) {
      endpoint += `portfolio=${portfolio}&portfolio=lol&`
    }
    endpoint = endpoint.slice(0, -1)
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  createNote: (title, content, stock_symbols, portfolio_names, external_references, internal_references) => {
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
  editNote: (old_title, new_title, content, stock_symbols, portfolio_names, external_references, internal_references) => {
    const endpoint = `/notes?note=${old_title}`;
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
  deleteNote: (title) => {
    const endpoint = `/notes?title=${title}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  }
};

export default NoteAPI;
