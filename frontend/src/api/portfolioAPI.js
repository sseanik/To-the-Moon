import * as config from "../config.json";
import Utils from "./utils";

const backend_url = `http://localhost:${config.BACKEND_PORT}`;

const portfolioAPI = {
  createPortfolio: (name, userID) => {
    const endpoint = "/create_portfolio";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        userID: userID,
      }),
    };

    /* return Utils.getJSON(`${backend_url}${endpoint}`, options); */
    return {
      name: "Karim Portfolio",
      stock_info: [
        {
          stock_name: "AMZN",
          stock_price: "$12.00",
        },
        {
          stock_name: "TEAM",
          stock_price: "$13.00",
        },
        {
          stock_name: "GOOGL",
          stock_price: "$9.99",
        },
      ],
    };
  },
  getPortfolio: (name) => {
    const endpoint = "/get_portfolio";
    const options = {};
    // get token from utils.js
    // make call to backend
  },
};

export default portfolioAPI;
