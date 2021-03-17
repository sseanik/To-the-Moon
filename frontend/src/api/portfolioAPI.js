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
        "Authorization": Utils.getToken(),
      }
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
  getPortfolios: () => {
    const endpoint = "/portfolio/getPortfolios";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Utils.getToken(),
      }
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
    // return {
    //   portfolios: [
    //     {
    //       portfolio_name: "Test 1",
    //     },
    //     {
    //       portfolio_name: "Test 2",
    //     },
    //     {
    //       portfolio_name: "Test 3",
    //     },
    //     {
    //       portfolio_name: "Test 4",
    //     },
    //     {
    //       portfolio_name: "Test 5",
    //     },
    //   ],
    // };
  },
  getStocks: (name) => {
    // subject to Austin endpoint naming
    const endpoint = `/portfolio/getInvestments?portfolioName=${name}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Utils.getToken(),
      }
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
    // return {
    //   name: "Karim",
    //   stock_info: [
    //     {
    //       stock_name: "AMZN",
    //       stock_price: "$12.00",
    //       purchase_date: "12-02-21",
    //       purchase_price: "$13.00",
    //       num_shares: "10",
    //     },
    //     {
    //       stock_name: "TEAM",
    //       stock_price: "$13.00",
    //       purchase_date: "01-01-20",
    //       purchase_price: "$5.00",
    //       num_shares: "50",
    //     },
    //     {
    //       stock_name: "GOOGL",
    //       stock_price: "$10.00",
    //       purchase_date: "16-03-21",
    //       purchase_price: "$10.00",
    //       num_shares: "100",
    //     },
    //   ],
    // };
  },
  deletePortfolio: (name) => {
    const endpoint = `/portfolio/deleteInvestment?portfolioName=${name}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Utils.getToken(),
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
        "Authorization": Utils.getToken(),
      }
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
};

export default portfolioAPI;
