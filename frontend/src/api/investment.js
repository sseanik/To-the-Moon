import * as config from "../config.json";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

const investmentAPI = {
  getStockTotalChange: (id) => {
    const endpoint = `/investment/total-change?id=${id}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  addStock: (portfolio, stockTicker, numShares, purchaseDate) => {
    const purchaseUnix = new Date(purchaseDate).getTime() / 1000;
    const endpoint = `/investment?portfolio=${portfolio}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        num_shares: numShares,
        purchase_date: purchaseUnix,
        stock_ticker: stockTicker,
      }),
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  deleteStock: (id) => {
    const endpoint = `/investment?id=${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getStocks: (portfolioName) => {
    const endpoint = `/user/investment?portfolio=${portfolioName}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
};

export default investmentAPI;
