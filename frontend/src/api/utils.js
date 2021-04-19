import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const handleError = (res) => {
  res.json().then((json) => {
    toast.error(json.message)
  })
}

const Utils = {
  getToken: () => window.localStorage.getItem("Token"),
  getJSON: (path, options) =>
    fetch(path, options)
      .then((res) => res.ok ? res.json() : handleError(res))
      .catch((err) => {
        console.warn(`API_ERROR: ${err}`);
        toast.error(err.message);
        throw err;
      }),
};

export default Utils;
