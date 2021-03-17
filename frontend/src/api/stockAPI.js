import * as config from "../config.json";
import Utils from "./utils";

const backend_url = `http://localhost:${config.BACKEND_PORT}`;

const stockAPI = {
  addStock: (portfolio_name, stock_name) => {
    const endpoint = `/portfolio/addInvestment?portfolioName=${portfolio_name}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Utils.getToken(),
      },
      body: JSON.stringify({
        purchasePrice: '10',
        numShares: 1,
        purchaseDate: new Date().toISOString().slice(0, 10),
        stockTicker: stock_name
      }),
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
  deleteStock: (investmentID) => {
    const endpoint = "/portfolio/deleteInvestment";
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Utils.getToken(),
      },
      body: {
        investmentID,
      },
    };

    return Utils.getJSON(`${backend_url}${endpoint}`, options);
  },
};

export default stockAPI;
