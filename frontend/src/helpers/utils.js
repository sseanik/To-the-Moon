import Utils from "../api/utils";

export const isLoggedIn = () => Utils.getToken() !== null;
