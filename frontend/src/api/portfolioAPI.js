import * as config from "../config.json";
import Utils from "./utils";

const backend_url = `http://localhost:${config.BACKEND_PORT}`;

const portfolioAPI = {
  createPortfolio: (name, token) => {
    const endpoint = "/portfolio/createPortfolio";
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
    const endpoint = "/portfolio/getPortfolios";
    const options = {
      method: "GET",
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
    const endpoint = "/portfolio/getInvestments";
    const options = {
      method: "GET",
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
          purchase_date: "12-02-21",
          purchase_price: "$13.00",
          num_shares: "10",
        },
        {
          stock_name: "TEAM",
          stock_price: "$13.00",
          purchase_date: "01-01-20",
          purchase_price: "$5.00",
          num_shares: "50",
        },
        {
          stock_name: "GOOGL",
          stock_price: "$10.00",
          purchase_date: "16-03-21",
          purchase_price: "$10.00",
          num_shares: "100",
        },
      ],
    };
  },
  deletePortfolio: (portfolio_name) => {
    const endpoint = "/portfolio/deleteInvestment";
    const options = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: {
        portfolio_name: portfolio_name,
        token: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
  editPortfolio: (portfolio_name, new_name) => {
    const endpoint = "/portfolio/editPortfolio";
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: {
        token: Utils.getToken(),
        oldPortfolioName: portfolio_name,
        newPortfolioName: new_name,
      },
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
};

export default portfolioAPI;
