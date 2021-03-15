import * as config from "../config.json";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

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

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
};

export default portfolioAPI;
