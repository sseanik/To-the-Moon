import * as config from "../config.json";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

const portfolioAPI = {
  getPortfolios: () => {
    const endpoint = "/user/portfolio";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getStocks: (name) => {
    const endpoint = `/user/investment?portfolio=${name}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  createPortfolio: (name) => {
    const endpoint = `/portfolio?name=${name}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  editPortfolio: (oldName, newName) => {
    const endpoint = `/portfolio?name=${oldName}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        name: newName,
      })
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  deletePortfolio: (name) => {
    const endpoint = `/portfolio?name=${name}`;
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

export default portfolioAPI;
