import * as config from "../config.json";
import Utils from "./utils";

const backend_url = `http://localhost:${config.BACKEND_PORT}`;

const portfolioAPI = {
  createPortfolio: (name) => {
    const endpoint = `/portfolio/createPortfolio?portfolioName=${name}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
  getPortfolios: () => {
    const endpoint = "/portfolio/getPortfolios";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
  getStocks: (name) => {
    // subject to Austin endpoint naming
    const endpoint = `/portfolio/getInvestments?portfolioName=${name}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
  deletePortfolio: (name) => {
    const endpoint = `/portfolio/deletePortfolio?portfolioName=${name}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
  editPortfolio: (old, _new) => {
    const endpoint = `/portfolio/editPortfolio?oldPortfolioName=${old}&newPortfolioName=${_new}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
};

export default portfolioAPI;
