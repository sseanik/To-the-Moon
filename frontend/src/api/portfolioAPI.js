import * as config from "../config.json";
import Utils from "./utils";

const backend_url = `http://localhost:${config.BACKEND_PORT}`;

const portfolioAPI = {
  createPortfolio: (name, token) => {
    const endpoint = "/create_portfolio";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        token: token,
      }),
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
  getPortfolios: () => {
    // subject to Austin endpoint naming
    const endpoint = "/getPortfolios";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        token: Utils.getToken(),
      },
    };

    /* return Utils.getJSON(`${backend_url}${endpoint}`, options); */
    return {
      portfolios: [
        {
          portfolio_name: "Test 1",
        },
        {
          portfolio_name: "Test 2",
        },
        {
          portfolio_name: "Test 3",
        },
        {
          portfolio_name: "Test 4",
        },
        {
          portfolio_name: "Test 5",
        },
      ],
    };
  },
  getStocks: (portfolio_name) => {
    // subject to Austin endpoint naming
    const endpoint = "/getStocks";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        portfolio_name: portfolio_name,
        token: Utils.getToken(),
      },
    };

    /* return Utils.getJSON(`${backend_url}${endpoint}`, options); */
    return {
      name: "Karim",
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
          stock_price: "$10.00",
        },
      ],
    };
  },
};

export default portfolioAPI;
