import * as config from "../config.json";
import Utils from "./utils";

const backend_url = `http://localhost:${config.BACKEND_PORT}`;

const stockAPI = {
  addStock: (portfolio_name, stock_name) => {
    const endpoint = "/portfolio/addInvestment";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        portfolio_name: portfolio_name,
        stock_name: stock_name,
        token: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
  deleteStock: (portfolio_name, stock_name) => {
    const endpoint = "/portfolio/deleteInvestment";
    const options = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: {
        portfolio_name: portfolio_name,
        stock_name: stock_name,
        token: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
};

export default stockAPI;
