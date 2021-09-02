import * as config from "../config.json";
import Utils from "./utils";

const url = config.API;

const portfolioAPI = {
  getPortfolios: () => {
    const endpoint = "/portfolio";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getPortfolioPerformance: (name: string) => {
    const endpoint = `/portfolio/performance?name=${encodeURI(name)}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  createPortfolio: (name: string) => {
    const endpoint = `/portfolio?name=${encodeURI(name)}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  editPortfolio: (oldName: string, newName: string) => {
    const endpoint = `/portfolio?name=${encodeURI(oldName)}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        name: newName,
      }),
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  deletePortfolio: (name: string) => {
    const endpoint = `/portfolio?name=${encodeURI(name)}`;
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
