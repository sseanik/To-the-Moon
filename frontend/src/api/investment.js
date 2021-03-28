import * as config from "../config.json";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

const stockAPI = {
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
  addStock: (portfolio, stock) => {
    const endpoint = `/investment?portfolio=${portfolio}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        purchasePrice: '10',
        numShares: 1,
        purchaseDate: new Date().toISOString().slice(0, 10),
        stockTicker: stock
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
};

export default stockAPI;
