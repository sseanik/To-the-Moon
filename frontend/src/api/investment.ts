import * as config from "../config.json";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

const investmentAPI = {
  getStockTotalChange: (id: string) => {
    const endpoint = `/portfolio/investment/total-change?id=${encodeURI(id)}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  addStock: (
    portfolio: string,
    stockTicker: string,
    numShares: number,
    purchaseDate: string
  ) => {
    const purchaseUnix = new Date(purchaseDate).getTime() / 1000;
    const endpoint = `/portfolio/investment?portfolio=${encodeURI(portfolio)}`;
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
  deleteStock: (id: string) => {
    const endpoint = `/portfolio/investment?id=${encodeURI(id)}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getStocks: (portfolioName: string) => {
    const endpoint = `/portfolio/investment?portfolio=${encodeURI(portfolioName)}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getTrendingStocks: (n: number) => {
    const endpoint = `/portfolio/investment/trending?n=${encodeURI(n)}`;
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
