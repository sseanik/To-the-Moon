import * as config from "../config.json";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

const DashboardAPI = {
  getUserDashboards: () => {
    const endpoint = "/dashboard";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  createUserDashboard: () => {
    const endpoint = "/dashboard";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getDashboardBlocks: (dashboardId: string) => {
    const endpoint = `/dashboard/${encodeURI(dashboardId)}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  createDashboardBlock: (
    dashboardId: string,
    type: string,
    meta: { [key: string]: any }
  ) => {
    const endpoint = `/dashboard/${encodeURI(dashboardId)}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
      body: JSON.stringify({
        type,
        meta,
      }),
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  deleteDashboard: (dashboardId: string) => {
    const endpoint = `/dashboard/${encodeURI(dashboardId)}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getBlockMeta: (blockId: string) => {
    const endpoint = `/dashboard/block/${encodeURI(blockId)}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: Utils.getToken(),
      },
    };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  deleteBlock: (blockId: string) => {
    const endpoint = `/dashboard/block/${encodeURI(blockId)}`;
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

export default DashboardAPI;
